#include <Windows.h>
#define NAPI_EXPERIMENTAL
#define NAPI_VERSION 4
#include <node_api.h>
#include <assert.h>
#include <stdio.h>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

inline wstring get_wstring(const napi_env& env, const napi_value& value) {
    size_t length;
    napi_status status = napi_get_value_string_utf16(env, value, nullptr, 0, &length);
    if (status != napi_ok)
        napi_throw_type_error(env, nullptr, "Could not get length of wstring");

    wstring result;
    result.reserve(length + 1);
    result.resize(length);
    status = napi_get_value_string_utf16(env, value, reinterpret_cast<char16_t*>(&result[0]), result.capacity(), nullptr);
    if (status != napi_ok)
        napi_throw_type_error(env, nullptr, "Could not get wstring");
    return result;
}

struct File_item {
	const std::wstring display_name;
	const bool is_directory;
	const bool is_hidden;
	const uint64_t size;
	const uint64_t time;
};

uint64_t convert_windowstime_to_unixtime(const FILETIME& ft) {
	ULARGE_INTEGER ull;
	ull.LowPart = ft.dwLowDateTime;
	ull.HighPart = ft.dwHighDateTime;
	return (ull.QuadPart / 10000000ULL - 11644473600ULL) * 1000;
}

void get_files(const wstring& directory, vector<File_item>& file_items) {
    auto search_string = (directory[directory.length()-1] == L'\\' || directory[directory.length()-1] == L'/') 
        ? directory + L"*.*"s
        : directory + L"\\*.*"s;
    replace(search_string.begin(), search_string.end(), L'/', L'\\'); 

    WIN32_FIND_DATAW w32fd{ 0 };
    auto ret = FindFirstFileW(search_string.c_str(), &w32fd);
    while (FindNextFileW(ret, &w32fd) == TRUE) {
        file_items.emplace_back(File_item {
            w32fd.cFileName,
            (w32fd.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY) == FILE_ATTRIBUTE_DIRECTORY,
            (w32fd.dwFileAttributes & FILE_ATTRIBUTE_HIDDEN) == FILE_ATTRIBUTE_HIDDEN,
            static_cast<uint64_t>(w32fd.nFileSizeHigh) << 32 | w32fd.nFileSizeLow,
            convert_windowstime_to_unixtime(w32fd.ftLastWriteTime)
        });
    }
}

napi_value Test(napi_env env, napi_callback_info info) {
    napi_deferred deferred;
    napi_value promise;
    auto status = napi_create_promise(env, &deferred, &promise);
    if (status != napi_ok) 
        return nullptr;


    napi_value then_callback;
    napi_get_named_property(env, promise, "then", &then_callback);
    
    napi_value global;
    status = napi_get_global(env, &global);
    
    napi_value argv[1];
    napi_create_string_utf8(env, "hello world", NAPI_AUTO_LENGTH, argv);    
     napi_value result;
    napi_call_function(env, promise, then_callback, 1, argv, &result);
    // Resolve or reject the promise associated with the deferred depending on
    // whether the asynchronous action succeeded.
    // u16string text = (char16_t*)(uint16_t*)L"Äh 🤣😜";
    // napi_value jsstr;
    // napi_create_string_utf16(env, text.c_str(), text.length(), &jsstr);
    // status = napi_resolve_deferred(env, deferred, jsstr);

    // At this point the deferred has been freed, so we should assign NULL to it.
    deferred = NULL;

    return promise;    
}

napi_value Add(napi_env env, napi_callback_info info) {
  napi_status status;

  size_t argc = 2;
  napi_value args[2];
  status = napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);
  assert(status == napi_ok);

  if (argc < 2) {
    napi_throw_type_error(env, nullptr, "Wrong number of arguments");
    return nullptr;
  }

  napi_valuetype valuetype0;
  status = napi_typeof(env, args[0], &valuetype0);
  assert(status == napi_ok);

  napi_valuetype valuetype1;
  status = napi_typeof(env, args[1], &valuetype1);
  assert(status == napi_ok);

//   napi_valuetype valuetype2;
//   status = napi_typeof(env, args[1], &valuetype2);
//   assert(status == napi_ok);

  //if (valuetype0 != napi_number || valuetype1 != napi_number || valuetype2 != napi_boolean) {
      if (valuetype0 != napi_number || valuetype1 != napi_number) {
    napi_throw_type_error(env, nullptr, "Wrong arguments");
    return nullptr;
  }

  double value0;
  status = napi_get_value_double(env, args[0], &value0);
  assert(status == napi_ok);

  double value1;
  status = napi_get_value_double(env, args[1], &value1);
  assert(status == napi_ok);

    // bool value2;
    // status = napi_get_value_bool(env, args[2], &value2);
    // assert(status == napi_ok);
  
  napi_value sum;
  status = napi_create_double(env, value0 + value1, &sum);
  assert(status == napi_ok);

  return sum;
}

napi_value get_files_sync(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value args[1];
    auto status = napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);
    assert(status == napi_ok);

    if (argc < 1) {
        napi_throw_type_error(env, nullptr, "Wrong number of arguments");
        return nullptr;
    }

    auto dir = get_wstring(env, args[0]);
    vector<File_item> files;
    get_files(dir, files);

    napi_value result;
    napi_create_array_with_length(env, files.size(), &result);

    int i{0};
    for(auto item: files) {
        napi_value obj;
        status = napi_create_object(env, &obj);
        assert(status == napi_ok);

        napi_value name;
        napi_create_string_utf16(env, reinterpret_cast<const char16_t*>(item.display_name.c_str()), 
            item.display_name.length(), &name);
        napi_set_named_property(env, obj, "name", name);

        napi_value size;
        napi_create_int64(env, static_cast<double>(item.size), &size);
        napi_set_named_property(env, obj, "size", size);

        napi_value time;
        napi_create_date(env, static_cast<double>(item.time), &time);
        napi_set_named_property(env, obj, "time", time);

        napi_value is_dir;
        napi_get_boolean(env, item.is_directory, &is_dir);
        napi_set_named_property(env, obj, "isDirectory", is_dir);

        napi_value is_hidden;
        napi_get_boolean(env, item.is_hidden, &is_hidden);
        napi_set_named_property(env, obj, "isHidden", is_hidden);

        napi_set_element(env, result, i++, obj);
    }        

    return result;
}

napi_value Init(napi_env env, napi_value exports) {
    napi_property_descriptor descriptors[] = {
        { "add", nullptr, Add, nullptr, nullptr, nullptr, napi_default, "add" },
        { "test", nullptr, Test, nullptr, nullptr, nullptr, napi_default, "test" },
        { "getFilesSync", nullptr, get_files_sync, nullptr, nullptr, nullptr, napi_default, "getFilesSync" }
    };
    auto status = napi_define_properties(env, exports, sizeof(descriptors)/sizeof(napi_property_descriptor), descriptors);
    assert(status == napi_ok);
    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)