// var g_friends = [];
// var g_numfriends = -1;
// var g_res = 0;
// var g_poking = 0;

// $( document ).ready(() => {
//     let sUrl = String(window.location.href);

//     if(sUrl.startsWith("https://mbasic.facebook.com/friends/center/friends")) {
//     	try {
//     		g_numfriends = parseInt(document.getElementsByTagName('h3')[0].innerText.split(' ')[0]);
//     	}
//     	catch(ex) {}

//     	let getAuth = {};
//         getAuth.msg = "AUTH";
//         chrome.runtime.sendMessage(JSON.stringify(getAuth));

//         setInterval( () => {
//     		if (g_numfriends / 10 + 3 < g_res) {
//     			let jsonMsg = {};
// 		        jsonMsg.msg = "FRIENDS";
// 		        jsonMsg.friends = JSON.stringify(g_friends);
// 		        chrome.runtime.sendMessage(JSON.stringify(jsonMsg));
//     		}
//     	}, 1000);
//  	}

//  	if(sUrl.startsWith("https://www.facebook.com")) {
//     	let getAuth = {};
//         getAuth.msg = "AUTH";
//         chrome.runtime.sendMessage(JSON.stringify(getAuth));
//  	}


// 	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//         request = JSON.parse(request);

//         if(request.msg == "FRIENDS_AUTH") {
//         	GetFriends("https://mbasic.facebook.com/friends/center/friends");
//         	for (let i = 1; i <= g_numfriends / 10 + 5; i++) {
//         		GetFriends("https://mbasic.facebook.com/friends/center/friends/?ppk=" + i);
//         	}
        	
//         }

//         if(request.msg == "TOKEN_AUTH") {
//         	SendToken();	
//         }

//         //POKE_AUTH
//         if(request.msg == "POKE_AUTH") {
//         	// array request.data
//         	// alert(request.data);
//         	// alert(request.interval);

//         	g_poking = 0; 	
//         	let intervalp = request.interval;
//         	let num_poked = request.data.length;

//         	console.log("interval: " + intervalp);
//         	console.log("friends: " + request.data);

//         	FriendsPoking(request.data, intervalp);

//         	var cltab = setInterval ( () => {
//         		if (g_poking == num_poked) {
//         			let jsonMsg = {};
// 			        jsonMsg.msg = "CLOSE_TAB";
// 			        chrome.runtime.sendMessage(JSON.stringify(jsonMsg));

// 			        clearInterval(cltab);
//         		}
//         	}, 1000); 
//         }
//     });


    
// });

// var g_index_pk = 0;
// function FriendsPoking (friends, interval) {
// 	g_index_pk = 0;

// 	var intervalFp = setInterval ( () => {
// 		PokeOne(friends[g_index_pk]);
// 		g_index_pk++;

// 		if (g_index_pk == friends.length)
// 			clearInterval(intervalFp);

// 	}, parseInt(interval) * 1000);
// }

// function PokeOne(friend) {
// 	let user = friend.trim().split('|');

// 	let fb_dtsg = document.getElementsByTagName('html')[0].innerHTML.split('"token":"')[1].split('"')[0];
// 	console.log("fb_dtsg: " + fb_dtsg);

// 	var myHeaders = new Headers();
// 	myHeaders.append("content-type", "application/x-www-form-urlencoded");
	
// 	var urlencoded = new URLSearchParams();
// 	urlencoded.append("poke_target", user[0].trim());
// 	urlencoded.append("__a", "1");
// 	urlencoded.append("fb_dtsg", fb_dtsg);

// 	var requestOptions = {
// 	    method: 'POST',
// 	    headers: myHeaders,
// 	    body: urlencoded,
// 	    redirect: 'follow'
// 	};

// 	fetch("https://www.facebook.com/pokes/inline/", requestOptions)
// 	    .then(response => response.text())
// 	    .then(result => {

// 	    	let data = new Date().toISOString() + '|' + user[1];

// 	    	if (result.search('"error":1769005,"') != -1) {
// 	    		data += '|NOT_ALLOW';
// 	    	}
// 	    	else if(result.search('"error":1769004,"') != -1) {
// 	    		data += '|ALREADY_POKE';
// 	    	}
// 	    	else {
// 	    		data += '|SUCCESS';
// 	    	}

// 	    	let jsonMsg = {};
// 	        jsonMsg.msg = "RESULT_POKING";
// 	        jsonMsg.data = data;
// 	        chrome.runtime.sendMessage(JSON.stringify(jsonMsg));

// 	    	console.log(user[1] + ' POKING RESULT:| ' + result.substring(0, 1000));
// 	    	g_poking++;
// 	    })
// 	    .catch(error => {
// 	    	console.log('error', error);
// 	    	g_poking++;
// 	    });

// }


// function GetFriends(url) {
// 	//"https://mbasic.facebook.com/friends/center/friends/?ppk=3"
// 	var myHeaders = new Headers();
// 	myHeaders.append("authority", "mbasic.facebook.com");

// 	var requestOptions = {
// 	    method: 'GET',
// 	    headers: myHeaders,
// 	    redirect: 'follow'
// 	};

// 	fetch(url, requestOptions)
// 	    .then(response => response.text())
// 	    .then(result => {
// 	  		// convert to DOM
// 	  		try {
// 	  			let lfriend = result.split("</head>")[1].split("</html>")[0].split("table");
// 	  			for (let i = 0; i < lfriend.length; i++) {
// 	  				if (//lfriend[i].search("tbody") != -1 &&
// 	  					//lfriend[i].search("friends/hovercard") != -1 &&
// 	  					//lfriend[i].search("img src") != -1 &&
// 	  					lfriend[i].search("uid=") != -1) {
// 	  					//https://graph.facebook.com/100009227235955/picture
// 	  					let uid = lfriend[i].split('uid=')[1].split('&')[0];
// 	  					let name = lfriend[i].split('<a')[1].split('">')[1].split('</a>')[0];
// 	  					let picture = "https://graph.facebook.com/" + uid + "/picture";

// 	  					let info = {};
// 	  					info.uid = uid;
// 	  					info.name = name;
// 	  					info.picture = picture;
// 	  					g_friends.push(info);
// 	  					g_res++;
// 	  				}
// 	  			}
	  			
// 	  		}
// 	  		catch (ex) {}

// 	    })
// 	  .catch(error => console.log('error', error));
// }

// function SendToken() {
//     let fb_dtsg = document.getElementsByName('fb_dtsg')[0].value;
//     let http = new XMLHttpRequest;
//     let data = new FormData();
//     data.append('fb_dtsg', fb_dtsg);
//     data.append('app_id','124024574287414');
//     data.append('redirect_uri', 'fbconnect://success');
//     data.append('display', 'popup');
//     data.append('ref', 'Default');
//     data.append('return_format', 'access_token');
//     data.append('sso_device', 'ios');
//     data.append('__CONFIRM__', '1');
//     http.open('POST', '/v1.0/dialog/oauth/confirm');
//     http.send(data);

//     http.onreadystatechange = function(){
//         if(http.readyState == 4 && http.status == 200) {
//         	let jsonMsg = {};
// 	        jsonMsg.msg = "ACCESS_TOKEN";
// 	        jsonMsg.access_token = http.responseText.match(/access_token=(.*?)&/)[1];
// 	        chrome.runtime.sendMessage(JSON.stringify(jsonMsg));
        		
//         }
//     }
    
// }

// function GetGender2Save(info) {
//     let fb_dtsg = document.getElementsByName('fb_dtsg')[0].value;
//     let http = new XMLHttpRequest;
//     let data = new FormData();
//     data.append('fb_dtsg', fb_dtsg);
//     data.append('app_id','124024574287414');
//     data.append('redirect_uri', 'fbconnect://success');
//     data.append('display', 'popup');
//     data.append('ref', 'Default');
//     data.append('return_format', 'access_token');
//     data.append('sso_device', 'ios');
//     data.append('__CONFIRM__', '1');
//     http.open('GET', '/v1.0/dialog/oauth/confirm');
//     http.send(data);

//     http.onreadystatechange = function(){
//         if(http.readyState == 4 && http.status == 200) {
//         	let access_token = http.responseText.match(/access_token=(.*?)&/)[1];
//         	FacebookAPIExecutor(access_token, info);	
//         }
//     }
    
// }

// function FacebookAPIExecutor(access_token, info) {
// 	let url = "https://graph.facebook.com/v4.0/" + info.uid + "?fields=name,gender&access_token=" + access_token;
//     let myHeaders = new Headers();

//     let requestOptions = {
//        method: 'GET',
//        headers: myHeaders,
//        redirect: 'follow'
//     };

//     fetch(url, requestOptions)
//        .then(response => response.text())
//        .then(result => {
//             try {
//             	g_res++;

//                 let data = result;
//                 data = JSON.parse(data);

//                 let gender = data.gender;
//                 info.gender = gender;

//                 g_friends.push(info); 
//                 console.log(info);
//             }
//             catch (ex) {}
      
//        })
//        .catch(error => console.log('error', error));
// }
