
$( document ).ready(() => { 
    (function(){
        $('#msbo').on('click', function(){
            $('body').toggleClass('msb-x');
        });
    }());

    GetAccountInfo(); 
    SetCookie();
});


function SetCookie() {
	chrome.cookies.getAll({ "url": "https://www.facebook.com" }, function (cookie) {
        var result = "";
        for (var i = 0; i < cookie.length; i++) {
            result += cookie[i].name + "=" + cookie[i].value + "; ";
        }

		document.getElementById('cookie').value = result;
    });
}

function GetAccountInfo() {
    let request_token = {};
    request_token.url = "https://business.facebook.com/business_locations/?nav_source=mega_menu";

    chrome.runtime.sendMessage(
        JSON.stringify(request_token),
        function(data){
            let access_token = data.slice(data.indexOf('EAAG')).split('"')[0];
            if (access_token != undefined) {
                GetUserInfo(access_token);
                GetGroupsInfo(access_token);
                GetFriendsInfo(access_token);
                GetFollowersInfo(access_token);
            }
            
        }
    );
}

function GetUserInfo(access_token) {
    let myHeaders = new Headers();
    let requestOptions = {
       method: 'GET',
       headers: myHeaders,
       redirect: 'follow'
    };
    let url = "https://graph.facebook.com/v4.0/me/?access_token=" + access_token;
    fetch(url, requestOptions)
       .then(response => response.text())
       .then(result => {
            let user_info = JSON.parse(result);
            GetUserInfoCallBack(user_info);
       })
       .catch(error => {
            console.log('error', error)
       });
}

function GetUserInfoCallBack(user_info) {
    if (user_info.id == undefined) {
        document.getElementById('user-info').innerHTML = 'Vui lòng đăng nhập Facebook để sử dụng!';
        document.getElementById('user-info').setAttribute("href", "https://facebook.com/");
    }
    else {
        document.getElementById('user-info').innerHTML = 'Xin chào ' + '<label style="font-weight: bold">' + user_info.name + '</label>';
        document.getElementById('user-info').setAttribute("href", "https://facebook.com/" + user_info.id);
    }
    
}

function GetGroupsInfo(access_token) {
    let myHeaders = new Headers();
    let requestOptions = {
       method: 'GET',
       headers: myHeaders,
       redirect: 'follow'
    };
    let url = "https://graph.facebook.com/v4.0/me/groups?fields=count&limit=6000&access_token=" + access_token;
    fetch(url, requestOptions)
       .then(response => response.text())
       .then(result => {
            let groups = JSON.parse(result);
            GetGroupInfoCallBack(groups);
       })
       .catch(error => {
            console.log('error', error)
       });
}

function GetGroupInfoCallBack(groups) {
    document.getElementById('num-groups').innerHTML = groups.data.length;
}

function GetFriendsInfo(access_token) {
    let myHeaders = new Headers();
    let requestOptions = {
       method: 'GET',
       headers: myHeaders,
       redirect: 'follow'
    };
    let url = "https://graph.facebook.com/v4.0/me/friends?fields=count&limit=10&access_token=" + access_token;
    fetch(url, requestOptions)
       .then(response => response.text())
       .then(result => {
            let friends = JSON.parse(result);
            GetFriendsInfoCallBack(friends);
       })
       .catch(error => {
            console.log('error', error)
       });
}

function GetFriendsInfoCallBack(groups) {
    document.getElementById('num-friends').innerHTML = groups.summary.total_count;
}

function GetFollowersInfo(access_token) {
    let myHeaders = new Headers();
    let requestOptions = {
       method: 'GET',
       headers: myHeaders,
       redirect: 'follow'
    };
    let url = "https://graph.facebook.com/v1.0/me/subscribers?fields=count&limit=10&access_token=" + access_token;
    fetch(url, requestOptions)
       .then(response => response.text())
       .then(result => {
            let followers = JSON.parse(result);
            GetFollowersInfoCallBack(followers);
       })
       .catch(error => {
            console.log('error', error)
       });
}

function GetFollowersInfoCallBack(followers) {
    document.getElementById('num-followers').innerHTML = followers.summary.total_count;
}