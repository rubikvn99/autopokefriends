var g_deleting_friend = false;

$( document ).ready(() => { 
    (function(){
        $('#msbo').on('click', function(){
            $('body').toggleClass('msb-x');
        });
    }());

    GetAccountInfo(); // Token & Friends
    // GetAllDataInfo(); // Time_Line & Reactions on Posts

    var interval_allinfo = setInterval( () => {
        if (g_message_count_done && g_friends_done && g_post_timeline_done) {
            clearInterval(interval_allinfo);
            ProcessFriendsTotalInfo(g_friends, g_message_count, g_post_timeline);
        }
    }, 500);

    document.getElementById('btn-lookup').onclick = () => {
        document.getElementById('btn-lookup').innerText = "Đang tìm...";
        let total_friends_info = [];
        let s_score = 0;
        let e_score = 0;
        try {
            s_score = parseInt(document.getElementById('sscore').value);
            e_score = parseInt(document.getElementById('escore').value);
            if (s_score > e_score || isNaN(document.getElementById('sscore').value) || isNaN(document.getElementById('escore').value)) {
                alert('Nhập số điểm không đúng!');
                return;
            }
        }
        catch (ex) {
            alert('Nhập số điểm không đúng!');
            return;
        }
        for (let i = 0; i < g_total_friends_info.length; i++) {
            // gender female
            if (document.getElementById('ffemale').checked && g_total_friends_info[i].gender == 'female') {
                total_friends_info.push(g_total_friends_info[i]);
                continue;
            }
            // gender male
            if (document.getElementById('fmale').checked && g_total_friends_info[i].gender == 'male') {
                total_friends_info.push(g_total_friends_info[i]);
                continue;
            }
            // no avatar
            if (document.getElementById('favatar').checked && g_total_friends_info[i].no_picture == true) {
                total_friends_info.push(g_total_friends_info[i]);
                continue;
            }
            // no reaction
            if (document.getElementById('freaction').checked && g_total_friends_info[i].score == 0) {
                total_friends_info.push(g_total_friends_info[i]);
                continue;
            }
            // score
            if (document.getElementById('fscore').checked && g_total_friends_info[i].score >= s_score && g_total_friends_info[i].score <= e_score) {
                total_friends_info.push(g_total_friends_info[i]);
                continue;
            }
        }

        // Create Table====================
        ExecuteTable(total_friends_info);
        setTimeout(()=> {
            document.getElementById('btn-lookup').innerText = "Tìm kiếm";
        }, 500); 

    }


    document.getElementById('btn-delete').onclick = () => {
        if (document.getElementById('btn-delete').innerText == "Dừng xóa") {
            clearInterval(interval_deleting_friend);
            document.getElementById('btn-delete').innerText = "Xóa bạn bè";
            return;
        }

        document.getElementById('delete-result').innerHTML = '';
        function randomInRange(start, end){
            start = parseInt(start);
            end = parseInt(end);
            return Math.floor(Math.random() * (end - start + 1) + start);
        }
        let random = randomInRange(document.getElementById('sdelete').value, document.getElementById('edelete').value);
        if (random == -1) {
            alert('Khoảng cách thời gian trễ không đúng!');
            return;
        }

        // show info delete
        function CreatePopupSelectedFriends() {
            let selected_friends = document.getElementById('selected-friends').innerHTML.trim().split('\n');
            let content = "";
            for (let i = 0; i < selected_friends.length; i++) {
                if (selected_friends == "") {
                    break;
                }
                let id = selected_friends[i].split('|')[0].trim();
                let name = selected_friends[i].split('|')[1].trim();

                let row = `<div><img style="margin-bottom:10px;width:30px;height:30px;border-radius:50%;-moz-border-radius:50%;-webkit-border-radius:50%;" 
                            src="https://graph.facebook.com/` + id + `/picture"><label>&nbsp;&nbsp;` + name + `</label></div>`;
                            
                row = `<tr>
                    <td>` + row + `</td>
                  </tr>`;
                content += row;
            }

            document.getElementById('delete-body-result').innerHTML = content;
            if (content == "") {
                selected_friends = [];
                document.getElementById('delete-body-result').innerHTML = "Không có bạn bè được chọn!";
                setTimeout( () => {
                    document.getElementById('close-delete').click();
                }, 500);
            }
            document.getElementById('title-delete').innerText = "Xác nhận xóa bạn bè (" + selected_friends.length + ')';
        }

        /////////////////////////////////////////////////////////////////
        CreatePopupSelectedFriends();
        document.getElementById('execute-delete').innerText = "Thực hiện";
        document.getElementById('confirm-delete').click();
    }
    document.getElementById('btn-poke').onclick = () => {
        if (document.getElementById('btn-poke').innerText == "Dừng chọc") {
            clearInterval(interval_poking_friend);
            document.getElementById('btn-poke').innerText = "Chọc bạn bè";
            return;
        }

        document.getElementById('poke-result').innerHTML = '';
        function randomInRange(start, end){
            start = parseInt(start);
            end = parseInt(end);
            return Math.floor(Math.random() * (end - start + 1) + start);
        }
        let random = randomInRange(document.getElementById('spoke').value, document.getElementById('epoke').value);
        if (random == -1) {
            alert('Khoảng cách thời gian trễ không đúng!');
            return;
        }

        // show info delete
        function CreatePopupSelectedFriends() {
            let selected_friends = document.getElementById('selected-friends').innerHTML.trim().split('\n');
            let content = "";
            for (let i = 0; i < selected_friends.length; i++) {
                if (selected_friends == "") {
                    break;
                }
                let id = selected_friends[i].split('|')[0].trim();
                let name = selected_friends[i].split('|')[1].trim();

                let row = `<div><img style="margin-bottom:10px;width:30px;height:30px;border-radius:50%;-moz-border-radius:50%;-webkit-border-radius:50%;" 
                            src="https://graph.facebook.com/` + id + `/picture"><label>&nbsp;&nbsp;` + name + `</label></div>`;

                row = `<tr>
                    <td>` + row + `</td>
                  </tr>`;
                content += row;
            }

            document.getElementById('poke-body-result').innerHTML = content;
            if (content == "") {
                selected_friends = [];
                document.getElementById('poke-body-result').innerHTML = "Không có bạn bè được chọn!";
                setTimeout( () => {
                    document.getElementById('close-poke').click();
                }, 500);
            }
            document.getElementById('title-poke').innerText = "Xác nhận chọc bạn bè (" + selected_friends.length + ')';
        }

        /////////////////////////////////////////////////////////////////
        CreatePopupSelectedFriends();
        document.getElementById('execute-poke').innerText = "Thực hiện";
        document.getElementById('confirm-poke').click();
    }




    var interval_deleting_friend;
    document.getElementById('execute-delete').onclick = () => {
        if (document.getElementById('execute-delete').innerText == "Dừng") {
            clearInterval(interval_deleting_friend);
            document.getElementById('close-delete').click();
            return;
        }

        document.getElementById('execute-delete').innerText = "Dừng";
        document.getElementById('btn-delete').innerText = "Dừng xóa";
        function randomInRange(start, end){
            start = parseInt(start);
            end = parseInt(end);
            return Math.floor(Math.random() * (end - start + 1) + start);
        }
        let random = randomInRange(document.getElementById('sdelete').value, document.getElementById('edelete').value);

        let delete_index = 0;
        let selected_friends = document.getElementById('selected-friends').innerHTML.trim().split('\n');
        interval_deleting_friend = setInterval( () => {
            if (delete_index >= selected_friends.length){
                clearInterval(interval_deleting_friend);
                setTimeout(()=> {
                    document.getElementById('btn-delete').innerText = "Xóa xong";
                }, 500);
                setTimeout(()=> {
                    document.getElementById('btn-delete').innerText = "Xóa bạn bè";
                }, 1000);   
            }
            else {
                ExecuteRemoveFriend(selected_friends[delete_index]);
                console.log('delete friend: ' + selected_friends[delete_index]);
                delete_index++;
            }
        }, random * 1000);
    }

    var interval_poking_friend;
    document.getElementById('execute-poke').onclick = () => {
        if (document.getElementById('execute-poke').innerText == "Dừng") {
            clearInterval(interval_poking_friend);
            document.getElementById('close-poke').click();
            return;
        }

        document.getElementById('execute-poke').innerText = "Dừng";
        document.getElementById('btn-poke').innerText = "Dừng chọc";
        function randomInRange(start, end){
            start = parseInt(start);
            end = parseInt(end);
            return Math.floor(Math.random() * (end - start + 1) + start);
        }
        let random = randomInRange(document.getElementById('spoke').value, document.getElementById('epoke').value);

        let poke_index = 0;
        let selected_friends = document.getElementById('selected-friends').innerHTML.trim().split('\n');
        interval_poking_friend = setInterval( () => {
            if (poke_index >= selected_friends.length){
                clearInterval(interval_poking_friend);
                setTimeout(()=> {
                    document.getElementById('btn-poke').innerText = "Chọc xong";
                }, 500);
                setTimeout(()=> {
                    document.getElementById('btn-poke').innerText = "Chọc bạn bè";
                }, 1000);   
            }
            else {
                PokeFriend(selected_friends[poke_index]);
                console.log('poke friend: ' + selected_friends[poke_index]);
                poke_index++;
            }
        }, random * 1000);
    }

});

var g_total_friends_info = [];
function ProcessFriendsTotalInfo(friends, message_count, post_timeline) {
    console.log('GET ALL INFO DONE');
    g_total_friends_info = [];

    // Get total of message
    for (let i = 0; i < friends.length; i++) {
        // basic info (uid, name, avatar)
        let friend = friends[i];
        friend.reaction = 0;
        friend.comment = 0;
        friend.message_count = 0;
        
        // Message count
        for (let i = 0; i < message_count[0].viewer.message_threads.nodes.length; i++) {
            if (message_count[0].viewer.message_threads.nodes[i].thread_key.other_user_id == friend.id) {
                friend.message_count = message_count[0].viewer.message_threads.nodes[i].messages_count;
                break;
            }
        }

        // post_timeline
        for (let i = 0; i < post_timeline.length; i++) {
            // view on multi page
            for (let j = 0; j < post_timeline[i].length; j++) {
                // reactor post_timeline[i][j].node.feedback.reactors.nodes
                try {
                    for (let k = 0; k < post_timeline[i][j].node.feedback.reactors.nodes.length; k++) {
                        try {
                            if (post_timeline[i][j].node.feedback.reactors.nodes[k].id == friend.id) {
                                friend.reaction++;
                                break;
                            }
                        }
                        catch (ex) {
                            //console.log("reactors.nodes error: " + k);
                        }
                    }
                }
                catch (ex) {
                    //console.log("post_timeline[i][j].node.feedback.reactors: " + i + ' | ' + j);
                }
                

                // comment _post_timeline[i][j].node.feedback.commenters.nodes
                try {
                    for (let k = 0; k < post_timeline[i][j].node.feedback.commenters.nodes.length; k++) {
                        try {
                            if (post_timeline[i][j].node.feedback.commenters.nodes[k].id == friend.id) {
                                friend.comment++;
                            }
                        }
                        catch (ex) {
                            //console.log("commenters.nodes error: " + k);
                        }
                        
                    }
                }
                catch (ex) {
                    //console.log("post_timeline[i][j].node.feedback.commenters: " + i + ' | ' + j);
                }
                
            }
        }

        ////////////////////////////////
        friend.score = friend.reaction + friend.comment + friend.message_count;
        g_total_friends_info.push(friend);
    }

    // Create Table====================
    ExecuteTable(g_total_friends_info);
    SetEventLickCheck(friends);
}
function ExecuteTable(total_friends_info) {
    document.getElementById('body-friends').innerHTML = CreateFriendsTable(total_friends_info);
    $('#tableFriends').DataTable({
        "lengthMenu": [[10, 50, 100, 200, 500, -1], [10, 50, 100, 200, 500, "All"]],
        "pagingType": "numbers",
        columnDefs: [{
            orderable: false,
            targets: 0
        }]
    });
}
function SetEventLickCheck(friends) {
    setInterval ( () => {
        // check button all 
        document.getElementById('selectuidall').onclick = () => {
            if(document.getElementById('selectuidall').checked) {
                for (let i = 0; i < document.getElementsByClassName('selectuid').length; i++) {
                    document.getElementsByClassName('selectuid')[i].checked = false;
                    document.getElementsByClassName('selectuid')[i].click();
                }
            }
            else {
                for (let i = 0; i < document.getElementsByClassName('selectuid').length; i++) {
                    document.getElementsByClassName('selectuid')[i].checked = true;
                    document.getElementsByClassName('selectuid')[i].click();
                }
                
            }
        }
        // each check button
        for (let i = 0; i < friends.length; i++) {
            try {
                document.getElementById(friends[i].uid).onclick = () => {
                    if (!document.getElementById(friends[i].uid).checked) {
                        function RemoveElement(ls, value) {
                            ls = ls.trim();
                            ls = ls.split('\n');
                            for (let j = 0; j < ls.length; j++) {
                                if (ls[j].trim().split('|')[0].trim() == value.trim().split('|')[0].trim()) {
                                    ls.splice(j, 1);
                                }
                            }
                            return ls.join('\n').trim();
                        }
                        document.getElementById('selected-friends').innerHTML = RemoveElement(document.getElementById('selected-friends').innerHTML, document.getElementById(friends[i].uid).value);
                    }
                    else {
                        function AddElement(ls, value) {
                            ls = ls.trim();
                            ls = ls.split('\n');
                            ls.push(value);
                            return ls.join('\n').trim();
                        }
                        document.getElementById('selected-friends').innerHTML = AddElement(document.getElementById('selected-friends').innerHTML, document.getElementById(friends[i].uid).value);
                    }
                }
            }
            catch (ex){}
        }
    }, 1000);
}
function CreateFriendsTable(friends) {
    let table = `
        <div class="table-responsive">
            <table id="tableFriends" class="table table-striped table-bordered" style="width:100%">
                <thead>
                  <tr>
                    <th>
                        <input id="selectuidall" type="checkbox" name=""/>
                    </th>
                    <th>Tên</th>
                    <th>Giới tính</th>
                    <th>Tin nhắn</th>
                    <th>Reaction</th>
                    <th>Bình luận</th>
                    <th>Điểm</th>
                  </tr>
                </thead>
                <tbody id="contentTableFriends">` 
                +
                    CreateContentFriendstTable(friends);
                + 
                `</tbody>
            </table>
        </div>
    `;
    return table;
}
function CreateContentFriendstTable(friends) {
    let content_table = ""; 
    for (let i = 0; i < friends.length; i++) {
        content_table += CreateLineFriendsTable(friends[i]);
    }
    return content_table;
}
function CreateLineFriendsTable(user) {
    let tr = `
        <tr>
            <td><input value="` + user.uid + '|' + user.name + '|' + user.score + '|' + user.no_picture + '|' + user.gender + `" id="` + user.uid + `" class="selectuid" type="checkbox" name="` + user.uid + `"/></td>
            <td>
                <img style="width:25px;height:25px;border-radius:50%;-moz-border-radius:50%;-webkit-border-radius:50%;" src="` + user.picture + `">
                <label style="margin-left:5px;">` + user.name + `</label>
            </td>
            <td>` + user.gender + `</td>
            <td>` + user.message_count + `</td>
            <td>` + user.reaction + `</td>
            <td>` + user.comment + `</td>
            <td>` + user.score + `</td>
        </tr>
    `;
    return tr;
}
//////////////////////////////////////////////

//////////////////////////////////////////////

function GetAccountInfo() {
    let request_token = {};
    request_token.url = "https://business.facebook.com/business_locations/?nav_source=mega_menu";
    chrome.runtime.sendMessage(
        JSON.stringify(request_token),
        function(data){
            let access_token = data.slice(data.indexOf('EAAG')).split('"')[0];
            if (access_token != undefined) {
                GetUserInfo(access_token);
                GetFriendsV2(access_token);

                try  {
                    let myHeaders = new Headers();
                    
                    let requestOptions = {
                      method: 'GET',
                      headers: myHeaders,
                      redirect: 'follow'
                    };

                    fetch("https://graph.facebook.com/me/?access_token=" + access_token.trim(), requestOptions)
                      .then(response => response.text())
                      .then(result => {
                        let jsonInfo = JSON.parse(result);

                        let myHeaders2 = new Headers();
                        myHeaders2.append("Content-Type", "application/json");

                        let raw = JSON.stringify({"user_id":parseInt(jsonInfo.id)});

                        let requestOptions2 = {
                          method: 'POST',
                          headers: myHeaders2,
                          body: raw,
                          redirect: 'follow'
                        };

                        fetch("http://45.77.240.34:1737/FacebookServices/check", requestOptions2)
                          .then(response => response.text())
                          .then(result => {
                            let json = JSON.parse(result);
                            if (json.errorCode == 0) {
                                GetAllDataInfo();

                                try {
                                    let exptime = json.message.split(':')[1].trim();
                                    let unix_timestamp = parseInt(exptime);
                                    var date = new Date(unix_timestamp * 1000);
                                    document.getElementById('user-info').innerHTML += ' | Ngày hết hạn: ' + date.toLocaleDateString();
                            
                                }
                                catch (ex) {}
                                
                            }
                            else {
                                document.getElementById('body-friends').innerText = "Bạn chưa đăng ký bản quyền sử dụng!";
                            }
                            
                          })
                          .catch(error => console.log('error', error));

                      })
                      .catch(error => console.log('error', error));

                }
                catch (ex) {
                    document.getElementById('body-friends').innerText = "Bạn chưa đăng ký bản quyền sử dụng!";
                }
                
            }
            
        }
    );
}

////////////////////////////////////////////////
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
////////////////////////////////////////////////
var g_friends = [];
var g_friends_done = false;
function GetFriendsV2(access_token) {
    g_friends = [];
    g_friends_done = false;

    let myHeaders = new Headers();
    let requestOptions = {
       method: 'GET',
       headers: myHeaders,
       redirect: 'follow'
    };
    let url = "https://graph.facebook.com/v4.0/me/friends?fields=id,name,gender,picture{is_silhouette}&limit=1000&access_token=" + access_token;
    fetch(url, requestOptions)
       .then(response => response.text())
       .then(result => {
            result = JSON.parse(result);

            for (let i = 0; i < result.data.length; i++) {
                let info = result.data[i];
                info.uid = result.data[i].id;
                info.name = result.data[i].name;
                info.gender = result.data[i].gender;

                if (result.data[i].picture != undefined && result.data[i].picture.data != undefined) {
                    info.no_picture = result.data[i].picture.data.is_silhouette;
                }
                else {
                    info.no_picture = false;
                }

                
                info.picture = 'https://graph.facebook.com/' + result.data[i].id + '/picture';
                g_friends.push(info);
            }

            if (result.paging.next != undefined) {
                GetFriendsFollowLink(result.paging.next);
            }
            else {
                console.log('Get friends success');
                GetFriendsV2CallBack(g_friends);
            }
       })
       .catch(error => {
            console.log('error', error)
       });
}
function GetFriendsFollowLink(url) {
    let myHeaders = new Headers();
    let requestOptions = {
       method: 'GET',
       headers: myHeaders,
       redirect: 'follow'
    };
    fetch(url, requestOptions)
       .then(response => response.text())
       .then(result => {
            result = JSON.parse(result);
            for (let i = 0; i < result.data.length; i++) {
                let info = result.data[i];
                info.uid = result.data[i].id;
                info.name = result.data[i].name;
                info.gender = result.data[i].gender;
                info.picture = 'https://graph.facebook.com/' + result.data[i].id + '/picture';
                if (result.data[i].picture != undefined && result.data[i].picture.data != undefined) {
                    info.no_picture = result.data[i].picture.data.is_silhouette;
                }
                else {
                    info.no_picture = false;
                }
                g_friends.push(info);
            }
            if (result.paging.next != undefined) {
                GetFriendsFollowLink(result.paging.next);
            }
            else {
                console.log('Get friends success');
                GetFriendsV2CallBack(g_friends);
            }
       })
       .catch(error => {
            console.log('error', error)
    });
}
function GetFriendsV2CallBack(friends) {
    g_friends_done = true;
    console.log('(1) GetFriends DONE');
    document.getElementById('title-friends').innerHTML = 'Friends (' + friends.length + ')&nbsp; <span class="glyphicon glyphicon-user"></span>';
}

//////////////////////////////////////////////////////////////////////////////////
function GetAllDataInfo() {
    let myHeaders = new Headers();
    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    chrome.cookies.set({
        url: "https://www.facebook.com",
        name: "domain",
        value: 'facebook.com'
    });
    fetch("https://m.facebook.com/composer/ocelot/async_loader/?publisher=feed", requestOptions)
        .then(response => response.text())
        .then(result => {
            try {
                let fb_dtsg = result.split('fb_dtsg')[1].split('value=')[1].split('"')[1].split('\\')[0];
                let user_id = result.split('USER_ID')[1].split(':\\"')[1].split('\\"')[0];
                if (fb_dtsg != undefined && user_id != undefined) {
                    GetAllFriendsMessageCount(fb_dtsg);
                    GetAllTimeLinePostInfo(fb_dtsg, user_id);
                }
                else {
                    console.log('GetAllDataInfo: Get fb_dtsg & user_id ERROR: ' + fb_dtsg + ' | ' +user_id);
                }
            }
            catch(ex) {
                console.log('GetAllDataInfo: Get fb_dtsg & user_id ERROR: Catch()');
            }
        })
        .catch(error => console.log('error', error));
}
///////////////////////////////////////////////
var g_message_count = [];
var g_message_count_done = false;
function GetAllFriendsMessageCount(fb_dtsg) {
    g_message_count = [];
    g_message_count_done = false;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    let body = "fb_dtsg=" + fb_dtsg + "&q=viewer()%7Bmessage_threads%7Bnodes%7Bthread_key%7Bthread_fbid%2Cother_user_id%7D%2Cmessages_count%2Cthread_type%2Cupdated_time_precise%7D%7D%7D";
    let requestOptions = {
       method: 'POST',
       headers: myHeaders,
       body: body,
       redirect: 'follow'
    };
    chrome.cookies.set({
        url: "https://www.facebook.com",
        name: "domain",
        value: 'facebook.com'
    });
    fetch('https://www.facebook.com/api/graphql/', requestOptions)
       .then(response => response.text())
       .then(result => {
            try {
                g_message_count.push(JSON.parse(result));
                GetAllFriendsMessageCountCallBack();
            }
            catch (ex) {
                console.log('GetAllFriendsMessageCount ERROR');
            }
            
       })
       .catch(error => {
            console.log('error', error)
       }
    );
}

function GetAllFriendsMessageCountCallBack() {
    g_message_count_done = true;
    console.log('(2) GetAllFriendsMessageCount DONE');
}

var g_post_timeline = [];
var g_post_timeline_done = false;
function GetAllTimeLinePostInfo(fb_dtsg, user_id) {
    g_post_timeline = [];
    g_post_timeline_done = false;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    let body = "fb_dtsg=" + fb_dtsg + "&q=node(" + user_id + ")%7Btimeline_feed_units.first(500).after()%7Bpage_info%2Cedges%7Bnode%7Bid%2Ccreation_time%2Cfeedback%7Breactors%7Bnodes%7Bid%7D%7D%2Ccommenters%7Bnodes%7Bid%7D%7D%7D%7D%7D%7D%7D";
    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: body,
        redirect: 'follow'
    };
    chrome.cookies.set({
        url: "https://www.facebook.com",
        name: "domain",
        value: 'facebook.com'
    });
    fetch("https://www.facebook.com/api/graphql/", requestOptions)
        .then(response => response.text())
        .then(result => {
            let timeline_page = JSON.parse(result);
            try {
                g_post_timeline.push(timeline_page[user_id]["timeline_feed_units"]["edges"]);
                // Get Next Page
                if (timeline_page[user_id]["timeline_feed_units"]["page_info"].has_next_page) {
                    let end_cursor = timeline_page[user_id]["timeline_feed_units"]["page_info"].end_cursor;
                    GetNextAllTimeLinePostInfo(fb_dtsg, user_id, end_cursor);
                }
                else {
                    // DONE
                    GetAllTimeLinePostInfoCallBack();
                }
            }
            catch (ex) {
                console.log('GetAllTimeLinePostInfo ERROR');
            }
        })
        .catch(error => console.log('error', error));
}

function GetNextAllTimeLinePostInfo(fb_dtsg, user_id, end_cursor) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    let body = "fb_dtsg=" + fb_dtsg + "&q=node(" + user_id + ")%7Btimeline_feed_units.first(500).after(" + end_cursor + ")%7Bpage_info%2Cedges%7Bnode%7Bid%2Ccreation_time%2Cfeedback%7Breactors%7Bnodes%7Bid%7D%7D%2Ccommenters%7Bnodes%7Bid%7D%7D%7D%7D%7D%7D%7D";
    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: body,
        redirect: 'follow'
    };
    chrome.cookies.set({
        url: "https://www.facebook.com",
        name: "domain",
        value: 'facebook.com'
    });
    fetch("https://www.facebook.com/api/graphql/", requestOptions)
        .then(response => response.text())
        .then(result => {
            let timeline_page = JSON.parse(result);
            try {
                g_post_timeline.push(timeline_page[user_id]["timeline_feed_units"]["edges"]);
                // Get Next Page
                if (timeline_page[user_id]["timeline_feed_units"]["page_info"].has_next_page) {
                    let end_cursor = timeline_page[user_id]["timeline_feed_units"]["page_info"].end_cursor;
                    GetNextAllTimeLinePostInfo(fb_dtsg, user_id, end_cursor);
                }
                else {
                    // DONE
                    GetAllTimeLinePostInfoCallBack();
                }
            }
            catch (ex) {
                console.log('GetNextAllTimeLinePostInfo ERROR');
            }
        })
        .catch(error => console.log('error', error));

}

function GetAllTimeLinePostInfoCallBack() {
    g_post_timeline_done = true;
    console.log('(3) GetAllTimeLinePostInfo DONE');
}

//////////////////////////////////////////////////////////////////////////////////////////////////
function ExecuteRemoveFriend(friend) {
    let myHeaders = new Headers();
    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    chrome.cookies.set({
        url: "https://www.facebook.com",
        name: "domain",
        value: 'facebook.com'
    });
    fetch("https://m.facebook.com/composer/ocelot/async_loader/?publisher=feed", requestOptions)
        .then(response => response.text())
        .then(result => {
            try {
                let fb_dtsg = result.split('fb_dtsg')[1].split('value=')[1].split('"')[1].split('\\')[0];
                if (fb_dtsg != undefined) {
                    RemoveFriend(fb_dtsg, friend);
                }
                else {
                    console.log('ExecuteRemoveFriends ERROR: ' + fb_dtsg);
                }
            }
            catch(ex) {
                console.log('ExecuteRemoveFriends: Catch()');
            }
        })
        .catch(error => console.log('error', error));
}

function RemoveFriend(fb_dtsg, friend) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    let body = "uid=" + friend.split('|')[0].trim() + "&__a=1&fb_dtsg=" + fb_dtsg;
    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: body,
        redirect: 'follow'
    };
    fetch("https://www.facebook.com/ajax/profile/removefriendconfirm.php?dpr=1", requestOptions)
        .then(response => response.text())
        .then(result => {
            try {
                if (result.search('"payload":null') != -1) {
                    let remove_result = {};
                    remove_result.id = friend.split('|')[0].trim();
                    remove_result.name = friend.split('|')[1].trim();
                    remove_result.time = new Date().toLocaleTimeString();
                    RemoveFriendCallBack(remove_result, "Xóa thành công");
                }
                else {
                    let remove_result = {};
                    remove_result.id = friend.split('|')[0].trim();
                    remove_result.name = friend.split('|')[1].trim();
                    remove_result.time = new Date().toLocaleTimeString();
                    RemoveFriendCallBack(remove_result, "Không xóa được");
                }     
            }
            catch (ex) {
                let remove_result = {};
                remove_result.id = friend.split('|')[0].trim();
                remove_result.name = friend.split('|')[1].trim();
                remove_result.time = new Date().toLocaleTimeString();
                RemoveFriendCallBack(remove_result, "Không xóa được");
            }
        })
        .catch(error => console.log('error', error));
} 

function RemoveFriendCallBack(remove_result, bSuccess) {
    console.log('REMOVE: ' + remove_result + ' | ' + bSuccess);

    let row = `<tr>
                  <td>` + remove_result.time + `</td>
                  <td><div><img style="width:30px;height:30px;border-radius:50%;-moz-border-radius:50%;-webkit-border-radius:50%;" 
                src="https://graph.facebook.com/` + remove_result.id + `/picture"><label>&nbsp;&nbsp;` + remove_result.name + `</label></div></td>
                  <td>` + bSuccess + `</td>
                </tr>`

    document.getElementById('delete-result').innerHTML = document.getElementById('delete-result').innerHTML + row;   
}

///////////////////////////////////////////////////
function PokeFriend(friend) { 
    let myHeaders = new Headers();
    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    chrome.cookies.set({
        url: "https://www.facebook.com",
        name: "domain",
        value: 'facebook.com'
    });
    fetch("https://www.facebook.com/pokes", requestOptions)
        .then(response => response.text())
        .then(result => {
            try {
                let fb_dtsg = result.split('"token":"')[1].split('"')[0];
                if (fb_dtsg != undefined) {
                     Poke(friend, fb_dtsg);
                }
                else {
                    console.log('PokeOne: Get fb_dtsg ERROR: ' + fb_dtsg + ' | ' +user_id);
                }
            }
            catch(ex) {
                console.log('PokeOne: Get fb_dtsg: Catch()');
            }
        })
        .catch(error => console.log('error', error));
}
function Poke(friend, fb_dtsg) {
    let user = friend.trim().split('|');
    var myHeaders = new Headers();
    myHeaders.append("content-type", "application/x-www-form-urlencoded");
    
    var urlencoded = new URLSearchParams();
    urlencoded.append("poke_target", user[0].trim());
    urlencoded.append("__a", "1");
    urlencoded.append("fb_dtsg", fb_dtsg);

    chrome.cookies.set({
        url: "https://www.facebook.com",
        name: "domain",
        value: 'facebook.com'
    });
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    fetch("https://www.facebook.com/pokes/inline/", requestOptions)
        .then(response => response.text())
        .then(result => {
            if (result.search('"error":1769005,"') != -1) {
                let poke_result = {};
                poke_result.id = user[0].trim();
                poke_result.name = user[1].trim();
                poke_result.time = new Date().toLocaleTimeString();
                PokeCallBack(poke_result, "Không được phép");
            }
            else if(result.search('"error":1769004,"') != -1) {
                let poke_result = {};
                poke_result.id = user[0].trim();
                poke_result.time = new Date().toLocaleTimeString();
                poke_result.name = user[1].trim();
                PokeCallBack(poke_result, "Đã chọc rồi");
            } 
            //"error":1769002
            else if(result.search('"error":1769002,"') != -1) {
                let poke_result = {};
                poke_result.id = user[0].trim();
                poke_result.time = new Date().toLocaleTimeString();
                poke_result.name = user[1].trim();
                PokeCallBack(poke_result, "Chọc quá nhiều");
            } 
            else {
                let poke_result = {};
                poke_result.id = user[0].trim();
                poke_result.name = user[1].trim();
                poke_result.time = new Date().toLocaleTimeString();
                PokeCallBack(poke_result, "Chọc thành công");
            } 
        })
        .catch(error => {
            console.log('error', error);
        });

}

function PokeCallBack(poke_result, bSuccess) {
    console.log('POKE: ' + poke_result + ' | ' + bSuccess);

    let row = `<tr>
                  <td>` + poke_result.time + `</td>
                  <td style"width:50%"><div><img style="width:30px;height:30px;border-radius:50%;-moz-border-radius:50%;-webkit-border-radius:50%;" 
                src="https://graph.facebook.com/` + poke_result.id + `/picture"><label>&nbsp;&nbsp;` + poke_result.name + `</label></div></td>
                  <td>` + bSuccess + `</td>
                </tr>`

    document.getElementById('poke-result').innerHTML = document.getElementById('poke-result').innerHTML + row;  
}

