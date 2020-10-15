chrome.runtime.onInstalled.addListener(function() {
});

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        for (var i = 0; i < details.requestHeaders.length; i++) {
            if (details.requestHeaders[i].name.toLowerCase() == "origin") {
                details.requestHeaders[i].value = "https://www.facebook.com";
                break;
            }
            if (i == details.requestHeaders.length - 1) {
                details.requestHeaders.push({
                    name: "origin",
                    value: "https://www.facebook.com"
                });
            }
        }
        details.requestHeaders.push({
            name: "referer",
            value: "https://www.facebook.com"
        });
        return { requestHeaders: details.requestHeaders };
    }, 
    {
        urls: [
            "https://*.facebook.com/*/dialog/oauth/confirm*",
            "https://*.facebook.com/api/graphqlbatch*",
            "https://*.facebook.com/pokes/dialog/?poke_target=*",
            "https://*.facebook.com/api/graphql*",
            "https://*.facebook.com/ajax/profile/removefriendconfirm.php*",
            "https://*.facebook.com/pokes/inline/*",
            "https://*.facebook.com/ajax/timeline/*"
        ]
    }, ["blocking", "requestHeaders", "extraHeaders"]
);


chrome.runtime.onMessage.addListener(
    function(request, httpMethod, onSuccess) {
        request = JSON.parse(request);
        chrome.cookies.set({
            url: "https://www.facebook.com",
            name: "domain",
            value: 'facebook.com'
        });
        fetch(request.url, { 
            credentials: 'include',
            mode: 'no-cors' 
        })
        .then(response => response.text())
        .then(responseText => onSuccess(responseText))
        return true; 
    }
);

_CreateTabOrFocus = (e, t) => 
{
    if (!("undefined" != typeof chrome && "tabs" in chrome))
        return !1;
    var o = chrome.tabs;
    o.query({
            url: e
        },
        (n) => {
            n.length > 0 ? o.update(n[0].id, {
                    active: !0
                },
                (e) => {
                    "function" == typeof t && t()
                }) : o.query({
                url: "chrome://newtab/*",
                status: "complete"
            }, (n) => {
                n.length > 0 ? o.update(n[0].id, {
                    url: e,
                    active: !0
                }, (e) => {
                    "function" == typeof t && t()
                }) : o.create({
                    url: e,
                    active: !0
                }, (e) => {
                    "function" == typeof t && t()
                })
            })
        })
}

chrome.browserAction.onClicked.addListener(()=> {
    _CreateTabOrFocus(chrome.extension.getURL("home.html"));
});

b64DecodeUnicode = (str) => {
    return atob(str);
}

b64EncodeUnicode = (str) => { 
    return btoa(str)
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// chrome.webRequest.onBeforeSendHeaders.addListener(
//   function (details) {
//     for (var i = 0; i < details.requestHeaders.length; ++i) {
//         if (details.requestHeaders[i].name === 'User-Agent') {
//             details.requestHeaders[i].value = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0";
//             break;
//         }
//     }
//     return { requestHeaders: details.requestHeaders };
//   },
//   { urls: ['https://m.facebook.com/pokes/*'] },
//   ['blocking', 'requestHeaders']
// );

// chrome.webRequest.onBeforeSendHeaders.addListener(
//   function (details) {
//     for (var i = 0; i < details.requestHeaders.length; ++i) {
//       if (details.requestHeaders[i].name === 'Origin') {
//         details.requestHeaders[i].value = "https://www.facebook.com";
//         break;
//       }
//     }
//     return { requestHeaders: details.requestHeaders };
//   },
//   { urls: ['https://www.facebook.com/pokes/*'] },
//   ['blocking', 'requestHeaders']
// );


// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     request = JSON.parse(request);

//     if (request.msg == "REFRESH") {
//         let total = null;
//         let frdataInfo = {};

//         // 1. Get Token
//         chrome.tabs.query({currentWindow: true}, function(tabs) {
//             for (let i = 0; i < tabs.length; i++) {
//                 if(tabs[i].url.search("https://www.facebook.com") != -1) {
//                     let jsonMsg = {};
//                     jsonMsg.msg = "GET_TOKEN";
//                     chrome.runtime.sendMessage(JSON.stringify(jsonMsg), function(response){
//                         let token = response.token;
                        
//                         // Get Friends


//                         // sendResponse({
//                         //     total: total,
//                         //     dataInfo: frdataInfo
//                         // });
//                     });

//                     break;
//                 }

//                 if (i == tabs.length - 1) {
//                     sendResponse({
//                         error: "No tabs of Facebook active!"
//                     });
//                 }
                
//             }

//         });

   
//     }



// });



