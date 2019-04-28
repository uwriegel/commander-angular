#define NAPI_EXPERIMENTAL
#include <napi.h>
#include <string>
#include "wstring.h"
#if WINDOWS
#include "windows/shell.h"
#elif LINUX
#endif
using namespace Napi;
using namespace std;

Value ShowInfo(const CallbackInfo& info) {
    auto file = info[0].As<WString>().WValue();
    show_properties(file.c_str());
    return info.Env().Undefined();
}

Object Init(Env env, Object exports) {
    exports.Set(String::New(env, "showInfo"), Function::New(env, ShowInfo));
    return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
