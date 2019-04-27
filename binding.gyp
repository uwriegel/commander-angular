{
    "targets": [{
        "target_name": "addon",
        "sources": [ 
            "cpp/addon.cc",
            "cpp/windows/shell.cpp"
        ],
        'include_dirs': ["<!@(node -p \"require('node-addon-api').include\")"],
        'dependencies': ["<!(node -p \"require('node-addon-api').gyp\")"],
        'cflags!': [ '-fno-exceptions' ],
        'cflags_cc!': [ '-fno-exceptions' ],
        'conditions': [
            ['OS=="win"', {
                'defines': ['WINDOWS'],
                "msvs_settings": {
                    "VCCLCompilerTool": {
                        "ExceptionHandling": 1
                    }
                }                
            }],
            ['OS=="linux"', {
                'defines': ['LINUX'],
                'sources!': [
                    './windows/utils.cpp'  
                ],
                'libraries!': [ 
                    "gdiplus.lib",
                    "Mincore.lib"
                ]
            }],
        ]          
    }]
}