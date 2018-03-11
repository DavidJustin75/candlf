var invalidemail = "Please input a valid email address";
var mismatchpassword = "Please check password";
var notloggedin = "Please sign in first.";
var missingCategoryName = "Missing page name";
var num = 0;

var status = "false";
var v_dirty = false;
var global_paper_id = "";
var global_kakao_url = "";
var global_post_direction = true;
var global_post_language = "";
var global_idx = 1;
var global_device = "";
var global_os = "";
var rep_list = "";

$(document).ready(function ($) {


    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAOYZvgzCCIOLYqasod1-YOBdSWKxvkpV0",
        authDomain: "r-spirit.firebaseapp.com",
        databaseURL: "https://r-spirit.firebaseio.com",
        storageBucket: "r-spirit.appspot.com",
        messagingSenderId: "230051853039"
    };
    firebase.initializeApp(config);


    window.fbAsyncInit = function () {
        FB.init({
            appId: '429775064038269',
            xfbml: true,
            version: 'v2.8'
        });
        FB.AppEvents.logPageView();
    };

    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { return; }
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));


    firebase.auth().onAuthStateChanged(function (user) {


        if (user) {

            console.log("auth");
            var name, email, photoUrl, uid;
            //console.log(user);

            name = user.displayName;
            email = user.email;
            photoUrl = user.photoURL;
            uid = user.uid;

            if (name != null) {
                $(".profileName").text(name);
                $(".profileEmail").text(email);

                $("#lblname").text(name);
                // console.log("1");
            }
            else {
                //   console.log("2");
                name = getCookie("tempid");
                // console.log(name);
                if (name != null && name != "") {
                    $(".profileName").text(name);
                    $("#lblname").text(name);
                    user.updateProfile({
                        displayName: name
                    });
                }
                else { $(".profileName").text(email); $("#lblname").text(email); }
            }

            if (photoUrl != null) {
                $(".profilePhoto").attr("src", photoUrl);

            }

            var cu = window.location.href;
            var n1 = cu.indexOf("login.html");
            var n2 = cu.indexOf("register.html");
            if (n1 > 0 || n2 > 0) {
                gotouser();
            }
            else {
                //
                setStatus(name);

                loadUserInfo();
            }



        } else {
            var cu = window.location.href;
            var n1 = cu.indexOf("login.html");
            var n2 = cu.indexOf("register.html");
            var n3 = cu.indexOf("public");
            if (n1 > 0 || n2 > 0) {

            }
            else if (n3 > 0) {
                loadPublic();
            }
            else {
                gotosignin();
            }
        }
    });


    $.fn.extend({
        cookieList: function (cookieName) {

            var cookie = $.cookie(cookieName);

            var items = [];
            try {
                //console.log('a');  
                items = cookie ? $.secureEvalJSON(cookie) : [];
            }
            catch (err) {
                items = [];
            }
            return {
                add: function (val) {
                    var index = items.indexOf(val.toString());
                    // Note: Add only unique values.
                    if (index == -1) {
                        items.push(val.toString());
                        $.cookie(cookieName, $.toJSON(items), { expires: 1 / 24, path: '/' });
                    }
                },
                remove: function (val) {
                    var index = items.indexOf(val.toString());

                    if (index != -1) {
                        items.splice(index, 1);
                        $.cookie(cookieName, $.toJSON(items), { expires: -1, path: '/' });
                    }
                },
                indexes: function (idx) {
                    if (items != null) {
                        return items[idx];
                    }
                    else {
                        return -9;
                    }
                },
                indexOf: function (val) {
                    if (val == undefined) {
                        return -9;
                    }
                    else if (items != null) {
                        console.log("?" + val);
                        //	return items.indexOf(val);
                        return items.indexOf(val.toString());
                    }
                    else {
                        return -9;
                    }
                },
                clear: function () {
                    items = null;
                    $.cookie(cookieName, null, { expires: -1, path: '/' });
                },
                items: function () {
                    return items;
                },
                length: function () {
                    if (items != null) {
                        return items.length;
                    }
                    else {
                        return "-1";
                    }
                },
                join: function (separator) {
                    return items.join(separator);
                }
            };
        }
    });




    window.onresize = function () {
        // your code

        var cu = window.location.href;
        var n1 = cu.indexOf("upload");
        if (n1 > 0) {
            showChart();
        }

    };

    (function (factory) {
        if (typeof define === 'function' && define.amd) {
            // AMD. Register as an anonymous module.
            define(['jquery'], function ($) {
                return factory($);
            });
        } else if (typeof module === 'object' && typeof module.exports === 'object') {
            // Node-like environment
            module.exports = factory(require('jquery'));
        } else {
            // Browser globals
            device_status = factory(window.jQuery);
            device_status_desc = device_status.desktop + device_status.name + device_status.platform + device_status.version;
            device_status_desc = device_status_desc.replace(/\./g, '-');
            //console.log("["+device_status_desc+"]");
            //console.log(device_status.desktop);
            console.log(device_status.platform); //os name chrome, opr, opera, msie, webkit, safari
            //console.log(device_status.platform);//device
            global_os = device_status.name;
            console.log(device_status.version);//os version
            //$("#devices").html("<span>" + device_status + "</span>");

            var _ver = device_status.version;

            var _ver2 = parseInt(_ver);

            if (device_status.name == "msie" && _ver2 < 11) {
                swal("Oops!!", "Please upgrade Internet Explorer to 11. Not supported in the following versions: Internet Explorer 6 standards, Internet Explorer 7 standards, Internet Explorer 8 standards, Internet Explorer 9 standards, Internet Explorer 10 standards.", 'error');
            }
            else {
                rep_list = new Map();
            }

            if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1)
            {
                 swal("Oops!!", "Please upgrade Windows Version. Not supported in the Windows 7", 'error');
            }

            if (device_status.desktop == undefined || device_status.desktop == false) {
                // skip
                $("#bdmain").addClass("mobile");
            }
            else {
                status = "true";
                global_device = "PC";

            }
        }
    }(function (jQuery) {
        "use strict";

        function uaMatch(ua) {
            // If an UA is not provided, default to the current browser UA.
            if (ua === undefined) {
                ua = window.navigator.userAgent;
            }
            ua = ua.toLowerCase();

            var match = /(edge)\/([\w.]+)/.exec(ua) ||
                /(opr)[\/]([\w.]+)/.exec(ua) ||
                /(chrome)[ \/]([\w.]+)/.exec(ua) ||
                /(version)(applewebkit)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua) ||
                /(webkit)[ \/]([\w.]+).*(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua) ||
                /(webkit)[ \/]([\w.]+)/.exec(ua) ||
                /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
                /(msie) ([\w.]+)/.exec(ua) ||
                ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec(ua) ||
                ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
                [];

            var platform_match = /(ipad)/.exec(ua) ||
                /(ipod)/.exec(ua) ||
                /(iphone)/.exec(ua) ||
                /(kindle)/.exec(ua) ||
                /(silk)/.exec(ua) ||
                /(android)/.exec(ua) ||
                /(windows phone)/.exec(ua) ||
                /(win)/.exec(ua) ||
                /(mac)/.exec(ua) ||
                /(linux)/.exec(ua) ||
                /(cros)/.exec(ua) ||
                /(playbook)/.exec(ua) ||
                /(bb)/.exec(ua) ||
                /(blackberry)/.exec(ua) ||
                [];

            var browser = {},
                matched = {
                    browser: match[5] || match[3] || match[1] || "",
                    version: match[2] || match[4] || "0",
                    versionNumber: match[4] || match[2] || "0",
                    platform: platform_match[0] || ""
                };

            if (matched.browser) {
                browser[matched.browser] = true;
                browser.version = matched.version;
                browser.versionNumber = parseInt(matched.versionNumber, 10);
            }

            if (matched.platform) {
                browser[matched.platform] = true;
            }

            // These are all considered mobile platforms, meaning they run a mobile browser
            if (browser.android || browser.bb || browser.blackberry || browser.ipad || browser.iphone ||
                browser.ipod || browser.kindle || browser.playbook || browser.silk || browser["windows phone"]) {
                browser.mobile = true;
            }

            // These are all considered desktop platforms, meaning they run a desktop browser
            if (browser.cros || browser.mac || browser.linux || browser.win) {
                browser.desktop = true;
            }

            // Chrome, Opera 15+ and Safari are webkit based browsers
            if (browser.chrome || browser.opr || browser.safari) {
                browser.webkit = true;
            }

            // IE11 has a new token so we will assign it msie to avoid breaking changes
            // IE12 disguises itself as Chrome, but adds a new Edge token.
            if (browser.rv || browser.edge) {
                var ie = "msie";

                matched.browser = ie;
                browser[ie] = true;
            }

            // Blackberry browsers are marked as Safari on BlackBerry
            if (browser.safari && browser.blackberry) {
                var blackberry = "blackberry";

                matched.browser = blackberry;
                browser[blackberry] = true;
            }

            // Playbook browsers are marked as Safari on Playbook
            if (browser.safari && browser.playbook) {
                var playbook = "playbook";

                matched.browser = playbook;
                browser[playbook] = true;
            }

            // BB10 is a newer OS version of BlackBerry
            if (browser.bb) {
                var bb = "blackberry";

                matched.browser = bb;
                browser[bb] = true;
            }

            // Opera 15+ are identified as opr
            if (browser.opr) {
                var opera = "opera";

                matched.browser = opera;
                browser[opera] = true;
            }

            // Stock Android browsers are marked as Safari on Android.
            if (browser.safari && browser.android) {
                var android = "android";

                matched.browser = android;
                browser[android] = true;
            }

            // Kindle browsers are marked as Safari on Kindle
            if (browser.safari && browser.kindle) {
                var kindle = "kindle";

                matched.browser = kindle;
                browser[kindle] = true;
            }

            // Kindle Silk browsers are marked as Safari on Kindle
            if (browser.safari && browser.silk) {
                var silk = "silk";

                matched.browser = silk;
                browser[silk] = true;
            }

            // Assign the name and platform variable
            browser.name = matched.browser;
            browser.platform = matched.platform;
            return browser;
        }

        // Run the matching process, also assign the function to the returned object
        // for manual, jQuery-free use if desired
        window.jQBrowser = uaMatch(window.navigator.userAgent);
        window.jQBrowser.uaMatch = uaMatch;

        // Only assign to jQuery.browser if jQuery is loaded
        if (jQuery) {
            jQuery.browser = window.jQBrowser;
        }

        return window.jQBrowser;
    }));



});


function loadUserInfo() {

    if (global_device == "PC") {
        $('[data-toggle="tooltip"]').tooltip();
    }

    var cu = window.location.href;
    var n1 = 0;
    var n2 = 0;
    var n3 = 0;
    var n4 = 0;

    n1 = cu.indexOf("ref");
    if (n1 > 0) {
        //
        loadMyMediaRef();
    }

    n2 = cu.indexOf("repository");
    if (n2 > 0) {
        //
        loadMyRepository();
    }

    n3 = cu.indexOf("public");
    if (n3 > 0) {
        loadPublic();
    }

    n4 = cu.indexOf("/candlf");
    if (n4 > 0) {
        console.log("Load Candlf");
        loadCandlf();
    }

}

function loadPublic() {

    var _vid = getUrlVars()["vid"];

    if (_vid == undefined) {
        //skip
    }
    else {
        var v_vid = CryptoJS.AES.decrypt(_vid, "66TADWD9Z86T65WDHZ85T65WECZ7ATAAW98Z7ETAEWDEZ77");
        v_vid = v_vid.toString(CryptoJS.enc.Utf8);
console.log("repository/" + v_vid + "/");

        var ref = firebase.database().ref("repository/" + v_vid + "/");

         console.log("repository/" + v_vid + "/");

        ref.once("value", function (data) {

/*
            if (global_os == "msie") {
                $("#my-video2-ms").empty();
                $("#my-video2-ms").attr('src', data.val().url);
            }
            else {*/
                $("#my-video2").empty();
                $("#my-video2").attr('src', data.val().url);
          //  }


        }); 

    }
}


function sharePage(pid, papertitle) {

    var v_newtitle = CryptoJS.AES.decrypt(papertitle, "66TADWD9Z86T65WDHZ85T65WECZ7ATAAW98Z7ETAEWDEZ77");
    v_newtitle = v_newtitle.toString(CryptoJS.enc.Utf8);

    var shareurl = 'https://www.moonpapers.com/public/#watch?pid=' + pid;
    FB.ui(
        {
            method: 'share',
            href: shareurl,
            caption: v_newtitle,
        }, function (response) { });
}


function running() {
    $('#imgLoading').css("display", "block");
}

function stopping() {
    $('#imgLoading').css("display", "none");
}


function loadMyRepository() {
    $(".masonry-container").empty();
    var user = firebase.auth().currentUser;
    var _url = "";
    var _name = "";

    running();

    if (user) {

        var ref = firebase.database().ref("repository/" + user.uid + "/");

        ref.once("value", function (data) {

            data.forEach(function (datas) {

                _url = CryptoJS.AES.encrypt(datas.val().url, "66TADWD9Z86T65WDHZ85T65WECZ7ATAAW98Z7ETAEWDEZ77");
                _name = CryptoJS.AES.encrypt(datas.val().title, "66TADWD9Z86T65WDHZ85T65WECZ7ATAAW98Z7ETAEWDEZ77");

                // console.log(datas.val().sharable);

                var statements = "";
                statements = statements + '<div id="C' + datas.key + '" class="card-box col-md-4 col-sm-4">';
                statements = statements + '    <div class="card">';
                statements = statements + '        <div class="header" id="IMG' + datas.key + '" style="background-image: url(\'' + datas.val().img + '\');  background-position: center center;  background-size: cover;">';
                statements = statements + '            <div class="category">';
                if (datas.val().sharable == "CC") {
                    statements = statements + '                <h6 class="label label-default">CC</h6>';
                }
                else {
                    statements = statements + '                <h6 class="label label-danger">My Media</h6>';
                }
                statements = statements + '            </div>';
                // statements = statements + '            <img src="' + datas.val().img + '" />';
                statements = statements + '           <div class="filter"></div>';
                statements = statements + '            <div class="actions">';
                statements = statements + '                <button class="btn btn-round btn-fill btn-neutral btn-modern" data-toggle="modal" data-target="#myModal" onclick="loadData(\'' + _url + '\',\'' + datas.val().type + '\',\'' + datas.key + '\')">';
                statements = statements + '                   Preview';
                statements = statements + '                 </button>';
                statements = statements + '            </div>';
                statements = statements + '        </div>';

                if (datas.val().sharable == "CC") {
                    statements = statements + '         <div class="social-line" data-buttons="1">';
                    statements = statements + '           <button class="btn btn-social" style="height: 61px;width: 100%;" data-toggle="tooltip" data-placement="bottom" title="Delete CC Media" onclick="deleteData2(\'' + datas.key + '\')">';
                    statements = statements + '              <i class="fa fa-trash-o"  style="font-size: 25px;"></i>';
                    statements = statements + '          </button>';
                    statements = statements + '       </div>';

                }
                else {
                    statements = statements + '         <div class="social-line" data-buttons="4">';
                    statements = statements + '            <button class="btn btn-social" style="height: 61px;" data-toggle="tooltip" data-placement="bottom" title="Share to Facebook" onclick="shareFacebook(\'' + datas.key + '\')">';
                    statements = statements + '                <i class="fa fa-facebook-square" style="font-size: 30px;"></i>';
                    statements = statements + '           </button>';
                    statements = statements + '            <button class="btn btn-social" style="height: 61px;" data-toggle="tooltip" data-placement="bottom" title="Share to KakaoTalk" onclick="shareKakao(\'' + user.uid + '\',\'' + datas.key + '\')">';
                    statements = statements + '               <a id="K' + datas.key + '" style="color:white" href="javascript:;"><img style="width:30px;padding-top:2px" src="assets/img/kakaolink.png"></a>';
                    statements = statements + '            </button>';
                    statements = statements + '            <button class="btn btn-social" style="height: 61px;" data-toggle="tooltip" data-placement="bottom" title="Share to candlf" onclick="loadPayment(\'' + datas.key + '\')">';
                    statements = statements + '               <i class="fa fa-share-alt"  style="font-size: 20px;"></i>';
                    statements = statements + '           </button>';
                    statements = statements + '           <button class="btn btn-social" style="height: 61px;" data-toggle="tooltip" data-placement="bottom" title="Delete My Media" onclick="deleteData(\'' + _name + '\',\'' + datas.key + '\')">';
                    statements = statements + '              <i class="fa fa-trash-o"  style="font-size: 25px;"></i>';
                    statements = statements + '          </button>';
                    statements = statements + '       </div>';
                }

                statements = statements + '      <div class="content" style="z-index: -1;height: 85px;">';
                statements = statements + '          <h6 class="category">' + datas.val().title + '</h6>';
                statements = statements + '      </div>';
                statements = statements + '  </div>';
                statements = statements + '</div>';
                $(".masonry-container").append(statements);

                if (global_device == "PC") {
                    $('[data-toggle="tooltip"]').tooltip();
                }

                var sdata2 = [];
                sdata2[1] = datas.val().title;
                sdata2[2] = datas.val().url;
                sdata2[3] = datas.val().img;

                rep_list.set(datas.key, sdata2);


            });
            stopping();



        }).then(function (result) {


            //
        });
    }
}



function loadCandlf() {
    $(".masonry-container").empty();
    var user = firebase.auth().currentUser;
    var _url = "";
    var _name = "";

    console.log("Load Candlf2");

    running();

    if (user) {

        var ref = firebase.database().ref("candlf/");

        ref.once("value", function (data) {

            data.forEach(function (datas) {

                _url = CryptoJS.AES.encrypt(datas.val().url, "66TADWD9Z86T65WDHZ85T65WECZ7ATAAW98Z7ETAEWDEZ77");
                _name = CryptoJS.AES.encrypt(datas.val().title, "66TADWD9Z86T65WDHZ85T65WECZ7ATAAW98Z7ETAEWDEZ77");

                // console.log(datas.val().sharable);

                var statements = "";
                statements = statements + '<div id="C' + datas.key + '" class="card-box col-md-4 col-sm-4">';
                statements = statements + '    <div class="card">';
                statements = statements + '        <div class="header" id="IMG' + datas.key + '" style="background-image: url(\'' + datas.val().img + '\');  background-position: center center;  background-size: cover;">';
                statements = statements + '            <div class="category">';
                statements = statements + '                <h6 class="label label-danger">' + datas.val().price + '</h6>';
                statements = statements + '            </div>';
                statements = statements + '           <div class="filter"></div>';
                statements = statements + '            <div class="actions">';
                statements = statements + '                <button class="btn btn-round btn-fill btn-neutral btn-modern" data-toggle="modal" data-target="#myModal" onclick="loadData(\'' + _url + '\',\'' + datas.val().type + '\',\'' + datas.key + '\')">';
                statements = statements + '                   Preview';
                statements = statements + '                 </button>';
                statements = statements + '            </div>';
                statements = statements + '        </div>';
                statements = statements + '         <div class="social-line" data-buttons="1">';
                statements = statements + '           <button class="btn btn-social" style="height: 61px;width: 100%;" data-toggle="tooltip" data-placement="bottom" title="Save to my repository" onclick="saveToRepFromCandlf(\'' + datas.key + '\')">';
                statements = statements + '              <i class="fa fa-download"  style="font-size: 25px;"></i>';
                statements = statements + '          </button>';
                statements = statements + '       </div>';
                statements = statements + '      <div class="content" style="z-index: -1;height: 85px;">';
                statements = statements + '          <h6 class="category">' + datas.val().title + '</h6>';
                statements = statements + '      </div>';
                statements = statements + '  </div>';
                statements = statements + '</div>';
                $(".masonry-container").append(statements);

                if (global_device == "PC") {
                    $('[data-toggle="tooltip"]').tooltip();
                }

            });
            stopping();



        }).then(function (result) {

            stopping();


            //
        });
    }
}


function loadPayment(_key) {

    $('#myModal2').modal('toggle');
    $("#lblrepkey").text(_key);
    $(".switch").bootstrapSwitch("setState", false)
    $("#slist").selectpicker('val', "Free");
    $("#txtsavecount").text(1);

    var ref = firebase.database().ref("candlf/" + _key + "/");

    ref.once("value", function (data) {

        if (data.child("price").exists()) {
            $("#slist").selectpicker('val', data.val().price);
        }

        if (data.child("count").exists()) {
            $("#txtsavecount").text(data.val().count);
            $(".switch").bootstrapSwitch("setState", true)
        }

    });

}



function loadData(_url, _type, _key) {

    var v_url = CryptoJS.AES.decrypt(_url, "66TADWD9Z86T65WDHZ85T65WECZ7ATAAW98Z7ETAEWDEZ77");
    v_url = v_url.toString(CryptoJS.enc.Utf8);

    if (_type.match('video')) {
/*
        if (global_os == "msie") {
            $("#my-video2-ms").empty();
            $("#my-video2-ms").attr('src', v_url);
        }
        else { */
            $("#my-video2").empty();
            $("#my-video2").attr('src', v_url);
       // }
        $("#my-pdf").addClass("notshowable");
        $("#my-img").addClass("notshowable");
        $("#my-video2").removeClass("notshowable");

    }
    else if (_type.match('image')) {

        $("#my-img").css('background-image', 'url("' + v_url + '")');
        $("#my-video2").addClass("notshowable");
     //   $("#my-video2-ms").addClass("notshowable");
        $("#my-pdf").addClass("notshowable");
        $("#my-img").removeClass("notshowable");
    }
    else {
        $("#my-pdf").empty();
        $("#my-pdf").attr('src', v_url);
        $("#my-video2").addClass("notshowable");
      //  $("#my-video2-ms").addClass("notshowable");
        $("#my-img").addClass("notshowable");
        $("#my-pdf").removeClass("notshowable");
    }

}


function deleteData(_name, _key) {

    var user = firebase.auth().currentUser;

    var v_name = CryptoJS.AES.decrypt(_name, "66TADWD9Z86T65WDHZ85T65WECZ7ATAAW98Z7ETAEWDEZ77");
    v_name = v_name.toString(CryptoJS.enc.Utf8);

    if (user) {

        var sref = firebase.database().ref("repository/" + user.uid + "/" + _key + "/");

        sref.remove()
            .then(function () {
                console.log("Remove succeeded.");
                swal("Message", "Delete media is complete", 'success');
                var storageRef = firebase.storage().ref();

                var desertRef = storageRef.child('data/' + user.uid + "/" + v_name);

                desertRef.delete().then(function () {

                    $("#C" + _key).remove();
                }).catch(function (error) {
                    // Uh-oh, an error occurred!
                    //  swal("Oops!!", error.message, 'error');
                    $("#C" + _key).remove();
                });

            })
            .catch(function (error) {
                swal("Oops!!", error.message, 'error');
            });

    }

}


function deleteData2(_key) {

    var user = firebase.auth().currentUser;

    if (user) {

        var sref = firebase.database().ref("repository/" + user.uid + "/" + _key + "/");

        sref.remove()
            .then(function () {
                console.log("Remove succeeded.");
                swal("Message", "Delete media is complete", 'success');
                $("#C" + _key).remove();

            })
            .catch(function (error) {
                swal("Oops!!", error.message, 'error');
            });

    }

}







function setKaKao() {

    Kakao.Link.createTalkLinkButton({
        container: '#kakao-link-btn',
        label: '쇼셜 웹 다이어리 문페이퍼',
        image: {
            src: 'https://www.moonpapers.com/dist/img/m_backimg3.png',
            width: '960',
            height: '960'
        },
        webButton: {
            text: $("#txtpapertitle").text(),
            url: global_kakao_url // 앱 설정의 웹 플랫폼에 등록한 도메인의 URL이어야 합니다.
        }
    });
}








function getBase64Image() {
    var canvas = document.getElementById("imgCanvas");
    //var img = document.getElementById("imageid");
    //canvas.width = img.width;
    //canvas.height = img.height;
    var ctx = canvas.getContext("2d");

    var img = new Image();
    img.src = document.getElementById("imageid").src;
    $("#imageid2").attr("src", img.src);
    img.onload = function () {

        // At this point, the image is fully loaded
        // So do your thing!
        ctx.drawImage(img, 400, 400);
        //console.log(ctx)
        var dataURL = canvas.toDataURL("image/png");
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    };


}


function getCurrentTime() {
    var t = "";

    var t1 = new Date();

    var yyyy = t1.getFullYear().toString();
    var mm = (t1.getMonth() + 1).toString();
    var dd = t1.getDate().toString();
    var hh = t1.getHours() < 10 ? "0" + t1.getHours() : t1.getHours();
    var min = t1.getMinutes() < 10 ? "0" + t1.getMinutes() : t1.getMinutes();
    var ss = t1.getSeconds() < 10 ? "0" + t1.getSeconds() : t1.getSeconds();


    t = yyyy + '/' + (mm[1] ? mm : "0" + mm[0]) + '/' + (dd[1] ? dd : "0" + dd[0]) + ' ' + hh + ':' + min + ":" + ss;

    return t;
}





function running() {
    $('#imgLoading').css("display", "block");
}

function stopping() {
    $('#imgLoading').css("display", "none");
}

function setStatus(newname) {

    var user = firebase.auth().currentUser;

    if (user) {

        // User is signed in.
        // console.log("setStatus");
        var name, email, photoUrl, uid;

        if (newname != "" && newname != null) {
            name = newname;
        }
        else {
            name = user.displayName;
        }
        emails = user.email;
        photoUrl = user.photoURL;
        uids = user.uid;

        var lasteventdate = getCurrentTime();
        firebase.database().ref('users/' + uids).set({
            username: name,
            email: emails,
            uid: uids,
            lasteventdate: lasteventdate
        });
    }

}


function getElapsedTime(str_basetime) {

    var comment = "";
    var date1 = new Date(str_basetime);
    var date2 = new Date();
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());

    var diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    var diffHours = Math.ceil(timeDiff / (1000 * 60 * 60));
    var diffMinutes = Math.ceil(timeDiff / (1000 * 60));
    var diffSeconds = Math.ceil(timeDiff / (1000));

    var c_1 = "at";
    var c_2 = "";
    var c_3 = "Yesterday";
    var c_4 = "hours ago";
    var c_5 = "minutes ago";
    var c_6 = "seconds ago";

    //console.log(timeDiff);
    //console.log(diffDays);
    //console.log(diffHours);
    //console.log(diffMinutes);
    //console.log(diffSeconds);


    if (date1.getHours() > 12) { c_2 = "pm"; }
    else { c_2 = "am"; }



    var temp_hour = date1.getHours();
    var temp_hours = "";

    var temp_min = date1.getMinutes();
    var temp_mins = "";


    if (temp_hour < 10) {
        temp_hours = temp_hour;
    }
    else if (temp_hour > 12) {
        temp_hours = temp_hour - 12;
    }
    else {
        temp_hours = temp_hour;
    }

    if (temp_min < 10) {
        temp_mins = '0' + temp_min;
    }
    else {
        temp_mins = temp_min;
    }


    if (diffSeconds < 60) {
        // Seconds
        comment = diffSeconds + " " + c_6;
    }
    else if (diffSeconds < 60 * 60) {
        // Minutes
        comment = diffMinutes + " " + c_5;
    }
    else if (diffSeconds < 60 * 60 * 24) {
        // Hours
        comment = diffHours + " " + c_4;
    }
    else if (diffSeconds < 60 * 60 * 24 * 2) {
        // Yesterday
        comment = c_3 + " " + c_1 + " " + temp_hours + ":" + temp_mins + " " + c_2;
    }
    else if (date1.getFullYear() != date2.getFullYear()) {

        comment = (parseInt(date1.getMonth()) + 1) + "/" +
            date1.getDate() + "/" + date1.getFullYear();

    }
    else {
        comment = (parseInt(date1.getMonth()) + 1) + "/" +
            date1.getDate() + " " + c_1 + " " +
            temp_hours + ":" +
            temp_mins + " " + c_2;

    }


    return comment;

}

function loadMyMediaFlip() {

    var ref = firebase.database().ref("repository/" + user.uid + "/");

    $(".flip-items").empty();
    var statement = "";
    ref.once("value", function (data) {

        data.forEach(function (datas) {
            statement = "";







        });

        var carousel = $("#carousel").flipster({
            style: 'carousel',
            spacing: -0.5,
            nav: true,
            buttons: true,
        });
    });
}

function sample(_no, _img) {
    var _src = "";
    if (_no == '1') {
        _src = 'https://firebasestorage.googleapis.com/v0/b/r-spirit.appspot.com/o/data%2F2pN6z2IM3nNIMPhQFrQwOfLC8ad2%2Fai_finance_story_20170311(reduce).webm?alt=media&token=4bc0fd55-6986-4f86-a4d0-74f5b8556d67'
    }
    else if (_no == '2') {
        _src = 'https://firebasestorage.googleapis.com/v0/b/r-spirit.appspot.com/o/data%2F2pN6z2IM3nNIMPhQFrQwOfLC8ad2%2FA.I.%20Learns%20Nobel%20Prize%20Experiment%20in%20Just%201%20Hour!.mp4?alt=media&token=e7aea598-3ab0-4a37-a06c-6fc9ea078154';
    }
    else if (_no == '3') {
        _src = 'https://firebasestorage.googleapis.com/v0/b/r-spirit.appspot.com/o/public%2FAfter%20watching%20this%2C%20your%20brain%20will%20not%20be%20the%20same%20-%20Lara%20Boyd%20-%20TEDxVancouver.mp4?alt=media&token=d81f79c5-d2fd-4589-a781-a650bb995ee9';

    }
    else if (_no == '4') {
        _src = 'https://firebasestorage.googleapis.com/v0/b/r-spirit.appspot.com/o/public%2FDemis%20Hassabis%2C%20CEO%2C%20DeepMind%20Technologies%20-%20The%20Theory%20of%20Everything.mp4?alt=media&token=597b8a3c-ecdb-4658-95c1-dee4deffc607';

    }
    else if (_no == '5') {
        _src = 'https://firebasestorage.googleapis.com/v0/b/r-spirit.appspot.com/o/public%2FHow%20artificial%20intelligence%20will%20make%20technology%20disappear%20-%20Rand%20Hindi%20-%20TEDxE%CC%81colePolytechnique.mp4?alt=media&token=5847c088-4495-448b-aa75-9cb0ad315ca9';

    }
    else if (_no == '6') {
        _src = 'https://firebasestorage.googleapis.com/v0/b/r-spirit.appspot.com/o/public%2FThe%20Deep%20End%20of%20Deep%20Learning%20-%20Hugo%20Larochelle%20-%20TEDxBoston.mp4?alt=media&token=6bbe37de-954d-4468-8606-9f3cb8aa04d7';

    }
    else if (_no == '7') {
        _src = 'https://firebasestorage.googleapis.com/v0/b/r-spirit.appspot.com/o/public%2FA%20friendly%20introduction%20to%20Deep%20Learning%20and%20Neural%20Networks.mp4?alt=media&token=8c97442e-74fa-4b4e-a87d-b42a5ad916b9';

    }
    else if (_no == '8') {
        _src = 'https://firebasestorage.googleapis.com/v0/b/r-spirit.appspot.com/o/public%2FA%20Friendly%20Introduction%20to%20Machine%20Learning.mp4?alt=media&token=0bbbbb44-0ff3-431b-950e-da4337f28181';

    }
    else if (_no == '9') {
        _src = 'https://firebasestorage.googleapis.com/v0/b/r-spirit.appspot.com/o/public%2FAfter%20watching%20this%2C%20your%20brain%20will%20not%20be%20the%20same%20-%20Lara%20Boyd%20-%20TEDxVancouver.mp4?alt=media&token=d81f79c5-d2fd-4589-a781-a650bb995ee9';

    }
    else if (_no == '10') {
        _src = 'https://firebasestorage.googleapis.com/v0/b/r-spirit.appspot.com/o/public%2FOptimization%20Calculus%201%20-%202%20Problems.mp4?alt=media&token=b7f8ec71-5858-4827-83c4-44f063f1441d';
    }
    else if (_no == '11') {
        _src = 'https://firebasestorage.googleapis.com/v0/b/r-spirit.appspot.com/o/public%2FOptimization%20with%20Calculus%201.mp4?alt=media&token=89f69a4b-2479-4855-81b8-458a520254ca';
    }
    else if (_no == '12') {
        _src = 'https://firebasestorage.googleapis.com/v0/b/r-spirit.appspot.com/o/public%2F%E2%9D%96%20Optimization%20Problem%20%231%20%E2%9D%96.mp4?alt=media&token=7c0190a2-2ccc-45db-9bb3-11e71cd847b4';

    }
    else if (_no == '13') {
        _src = 'https://firebasestorage.googleapis.com/v0/b/r-spirit.appspot.com/o/public%2FStatistics%20with%20R%20(1)%20-%20Linear%20regression.mp4?alt=media&token=a8fcdebb-81b0-4c49-9959-feea0bd75370';
    }
    else if (_no == '14') {
        _src = 'https://firebasestorage.googleapis.com/v0/b/r-spirit.appspot.com/o/public%2FWhat%20is%20RStudio%20and%20Why%20Should%20You%20Downlaod%20It%20(R%20Tutorial%201.1).mp4?alt=media&token=effbe03f-a564-4ce8-b3cb-ee9d28743ee5';

    }


    $("#my-video").empty();
    $("#my-video").append('<source src="' + _src + '" type="video/mp4">');
    // var video = document.getElementById('video');
    $("#my-video").load();
    //$("#my-video").play();
    /*
        $("#my-video").ready(function() {
          // hide the video UI
          $("#div_video_html5_api").hide();
          // and stop it from playing
          $("#my-video").pause();
          // assign the targeted videos to the source nodes
          $("video:nth-child(1)").attr("src",_src);
          // replace the poster source
       //   $("img.vjs-poster").attr("src",$content_path+$target+".png").show();
          // reset the UI states
          $(".vjs-big-play-button").show();
          $("#div_video").removeClass("vjs-playing").addClass("vjs-paused");
          // load the new sources
          $("#my-video").load();
          $("#div_video_html5_api").show();
        });
    */

    $("#lbltitle").text("#Lec" + _no.toString());
    $("#lblimage").text(_img);
    $("#lblsrc").text(_src);
}


function loadMyMediaRef() {

    // $("#my-video").empty();
    // $("#my-video").attr('src', 'https://firebasestorage.googleapis.com/v0/b/r-spirit.appspot.com/o/public%2Fai.webm?alt=media&token=6367a134-ef0e-4605-a462-25bcc4b9f74f');


    /*
        var myPlayer = videojs('my-video');
    
        var _url = 'https://firebasestorage.googleapis.com/v0/b/r-spirit.appspot.com/o/public%2Fai.webm?alt=media&token=6367a134-ef0e-4605-a462-25bcc4b9f74f';
    
        myPlayer.src({ type: "video/webm", src: _url });
    
        var aspectRatio = 9 / 16; // Make up an aspect ratio
    
        function resizeVideoJS() {
            // Get the parent element's actual width
            var width = document.getElementById(myPlayer.id).parentElement.offsetWidth;
            // Set width to fill parent element, Set height
            myPlayer.width(width).height(width * aspectRatio);
        }
    
        resizeVideoJS(); // Initialize the function
        window.onresize = resizeVideoJS; // Call the function on resize
    */
}

function showChart() {

    $("#svgData").empty();

    var links = [
        { source: "Microsoft", target: "Amazon", type: "licensing" },
        { source: "Microsoft", target: "HTC", type: "licensing" },
        { source: "Samsung", target: "Apple", type: "suit" },
        { source: "Motorola", target: "Apple", type: "suit" },
        { source: "Nokia", target: "Apple", type: "resolved" },
        { source: "HTC", target: "Apple", type: "suit" },
        { source: "Kodak", target: "Apple", type: "suit" },
        { source: "Microsoft", target: "Barnes & Noble", type: "suit" },
        { source: "Microsoft", target: "Foxconn", type: "suit" },
        { source: "Oracle", target: "Google", type: "suit" },
        { source: "Apple", target: "HTC", type: "suit" },
        { source: "Microsoft", target: "Inventec", type: "suit" },
        { source: "Samsung", target: "Kodak", type: "resolved" },
        { source: "LG", target: "Kodak", type: "resolved" },
        { source: "RIM", target: "Kodak", type: "suit" },
        { source: "Sony", target: "LG", type: "suit" },
        { source: "Kodak", target: "LG", type: "resolved" },
        { source: "Apple", target: "Nokia", type: "resolved" },
        { source: "Qualcomm", target: "Nokia", type: "resolved" },
        { source: "Apple", target: "Motorola", type: "suit" },
        { source: "Microsoft", target: "Motorola", type: "suit" },
        { source: "Motorola", target: "Microsoft", type: "suit" },
        { source: "Huawei", target: "ZTE", type: "suit" },
        { source: "Ericsson", target: "ZTE", type: "suit" },
        { source: "Kodak", target: "Samsung", type: "resolved" },
        { source: "Apple", target: "Samsung", type: "suit" },
        { source: "Kodak", target: "RIM", type: "suit" },
        { source: "Nokia", target: "Qualcomm", type: "suit" }
    ];

    var nodes = {};

    // Compute the distinct nodes from the links.
    links.forEach(function (link) {
        link.source = nodes[link.source] || (nodes[link.source] = { name: link.source });
        link.target = nodes[link.target] || (nodes[link.target] = { name: link.target });
    });

    var width = 0;
    var height = 489;


    var v_w = $(window).width();

    if (v_w > 1199) {
        width = 710;
    }
    else if (v_w > 991) {
        width = 576;
    }
    else if (v_w > 767) {
        width = 430;
    }
    else if (v_w > 767) {
        width = 690;
    }
    else {
        width = v_w;
    }

    var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width, height])
        .linkDistance(60)
        .charge(-300)
        .on("tick", tick)
        .start();

    var svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height);

    // Per-type markers, as they don't inherit styles.
    svg.append("defs").selectAll("marker")
        .data(["suit", "licensing", "resolved"])
        .enter().append("marker")
        .attr("id", function (d) { return d; })
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5");

    var path = svg.append("g").selectAll("path")
        .data(force.links())
        .enter().append("path")
        .attr("class", function (d) { return "link " + d.type; })
        .attr("marker-end", function (d) { return "url(#" + d.type + ")"; });

    var circle = svg.append("g").selectAll("circle")
        .data(force.nodes())
        .enter().append("circle")
        .attr("r", function (d) { if (d.name == "Samsung") { return 36; } else { return 6; } })
        .attr("onclick", function (d) { return 'call(\'' + d.name + '\')'; })
        .attr("class", "point")
        .call(force.drag);

    var text = svg.append("g").selectAll("text")
        .data(force.nodes())
        .enter().append("text")
        .attr("x", 8)
        .attr("y", ".31em")
        .text(function (d) { return d.name; });

    // Use elliptical arc path segments to doubly-encode directionality.
    function tick() {
        path.attr("d", linkArc);
        circle.attr("transform", transform);
        text.attr("transform", transform);
    }

    function linkArc(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    }

    function transform(d) {
        return "translate(" + d.x + "," + d.y + ")";
    }
}

function shareKakao(_uid, _key) {
    // console.log("call");
    var pdata2 = [];
    pdata2 = rep_list.get(_key);

    var vid = CryptoJS.AES.encrypt(_uid + "/" + _key, "66TADWD9Z86T65WDHZ85T65WECZ7ATAAW98Z7ETAEWDEZ77");

    var v_title = pdata2[1];
    var v_url = 'https://www.candlf.com/public/#u?vid=' + vid;
    var v_cap = "Education platform Candlf";

    console.log(v_url);


    Kakao.Link.createTalkLinkButton({
        container: '#K' + _key,
        label: v_cap,
        image: {
            src: "https://www.candlf.com/dist/rspirit/img/m_backimg.png",
            width: '960',
            height: '960'
        },
        webButton: {
            text: v_title,
            url: v_url
        }
    });



}

function shareFacebook(_key) {


    var pdata2 = [];
    pdata2 = rep_list.get(_key);

    var v_title = pdata2[1];
    var v_url = pdata2[2];
    var v_pic = pdata2[3];
    var v_cap = "Education platform Candlf";

    FB.ui(
        {
            method: 'share',
            href: v_url,     // The same than link in feed method
            title: v_title,  // The same than name in feed method
            caption: v_cap,
            picture: "https://www.candlf.com/dist/rspirit/img/m_backimg.png"
        },
        function (response) {
            // your code to manage the response

        });
}


function call(v_name) {

    $("#tags2").addTag(v_name);

}

function gotosignin() {

    window.open('https://www.candlf.com/login.html', '_self', false);

}

function gotouser() {

    window.open('https://www.candlf.com/upload/', '_self', false);

}

function gotorep() {

    window.open('https://www.candlf.com/ref/', '_self', false);

}



function notsupportedyet() {
    swal("Oops!!", "Sorry, this function not supported yet!", 'error');
}

function signUser(email, password) {

    // global_displayname="test";
    //console.log("2");
    firebase.auth().signInWithEmailAndPassword(email, password).then(function (result) {
        //	console.log("1");

    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error.message);
        swal("Oops!!", error.message, 'error');
    });
}

function createUser(displayname, email, password) {

    var v_msg = "Username is required";


    if (displayname == "") {
        swal("Oops!!", v_msg, 'error');
    }
    else {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function (user) {
            setCookie("tempid", displayname, 1);
            // global_displayname=displayname;

        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            swal("Oops!!", error.message, 'error');

        });
    }

}


$("#wizard-picture").change(function (event) {
    var file = event.target.files[0];

    if (checkFile(file)) {
        var fileReader = new FileReader();
        if (file.type.match('image')) {
            fileReader.onloadend = function (evt) {
                /*
              var img = document.createElement('img');
              img.src = fileReader.result;
              $('#pnlSnap')[0].appendChild(img);*/

                $("#imgSnapShot").attr("src", fileReader.result);
                // saveToFirebaseStorage(evt, file);
                saveToDatabase(fileReader.result, file);

                $("#fileStatus").text("complete");
                showChart();

                swal("Message", "Upload complete. please click next button", 'success');

                $(".pnlAfter").addClass("notshowable");
                $(".pnlReLoad").removeClass("notshowable");
            };
            fileReader.readAsDataURL(file);
            //fileReader.readAsArrayBuffer(file);
        } else if (file.type.match('video')) {
            fileReader.onloadend = function (evt) {
                var blob = new Blob([fileReader.result], { type: file.type });
                var url = URL.createObjectURL(blob);
                var video = document.createElement('video');
                var timeupdate = function () {
                    if (snapImage()) {
                        video.removeEventListener('timeupdate', timeupdate);
                        video.pause();
                    }
                };
                video.addEventListener('loadeddata', function () {
                    if (snapImage()) {
                        video.removeEventListener('timeupdate', timeupdate);
                    }
                });
                var snapImage = function () {
                    var canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                    var image = canvas.toDataURL();
                    //    image.onload = function () {
                    var success = image.length > 10000;
                    if (success) {
                        /*
                      var img = document.createElement('img');
                      img.src = image;
                      $('#pnlSnap')[0].appendChild(img);*/

                        $("#imgSnapShot").attr("src", image);

                        saveToFirebaseStorage(evt, file);

                        URL.revokeObjectURL(url);
                    }
                    else {
                        swal({
                            title: "Do you want to upload without thumbnail?",
                            text: "Sorry, we could not generate thumbnail from file",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Yes, Keep going!",
                            closeOnConfirm: true
                        },
                            function () {

                                $("#imgSnapShot").attr("src", 'https://www.candlf.com/dist/rspirit/img/mp4.png');
                                saveToFirebaseStorage(evt, file);

                            });

                    }

                    return 1;

                };
                video.addEventListener('timeupdate', timeupdate);
                video.preload = 'metadata';
                video.src = url;
                // Load video in Safari / IE11
                video.muted = true;
                video.playsInline = true;
                video.play();
            };
            fileReader.readAsArrayBuffer(file);
        }
        else if (file.type.match('pdf')) {
            fileReader.onloadend = function (evt) {
                $("#imgSnapShot").attr("src", 'https://www.candlf.com/dist/rspirit/img/pdf.png');
                saveToFirebaseStorage(evt, file);

            };
            fileReader.readAsArrayBuffer(file);
        }
        else {

        }
    }
    else {
        //
    }
});




/*

$("#wizard-picture").change(function () {
    readURL(this);
});
*/



function checkFile(input) {
    var items = input;
    var lg = input.length; // get length
    var _type = items.type;
    var _size = items.size;
    var _itemsize = Math.round(items.size / 1024 / 1024);

    _type = _type.toLowerCase();

    if (_size > 50000000) {
        //show an alert to the user
        swal("Oops!!", "Allowed file size exceeded. (Max. 50 MB), Current file size is [" + _itemsize + " MB]", 'error');
        $("#fileStatus").text("Fail");
        return false;
    }
    else if (_type.match('image') || _type.match('pdf') || (_type.match('video') && _type.indexOf('mp4') != -1) || (_type.match('video') && _type.indexOf('mp3') != -1)) {
        $("#lblFileName").text(items.name);
        $("#lblFileType").text(items.type);

        var _itemsize2 = _itemsize.toLocaleString();
        $("#lblFileSize").text(_itemsize2 + " MB");

        $("#pnlBefore").addClass("notshowable");
        $(".pnlAfter").removeClass("notshowable");

        return true;
    }
    /*
    else if (_type.match('video') && _type.indexOf('mp4') == -1) {
        swal("Oops!!", "Video is only alllowed mp4 file type", 'error');
        $("#fileStatus").text("Fail");
        return false;
    }*/
    else {
        swal("Oops!!", "Not allowed file type. Current file type is [" + _type + " ]", 'error');
        $("#fileStatus").text("Fail");
        return false;

    }
}

function saveToFirebaseStorage(evt, items) {
    var user = firebase.auth().currentUser;

    if (user) {

        var blob = new Blob([evt.target.result], { type: items.type });
        var storage = firebase.storage();
        var storageRef = firebase.storage().ref();

        var uploadTask = storageRef.child('data/' + user.uid + "/" + items.name).put(blob);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed', function (snapshot) {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            $("#txtProgress").text(Math.round(progress) + "%");
            //console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    swal("Oops!!", "Upload is paused", 'error');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
        }, function (error) {
            // Handle unsuccessful uploads
            swal("Oops!!", error, 'error');
        }, function () {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            var downloadURL = uploadTask.snapshot.downloadURL;
            $("#fileStatus").text("complete");
            showChart();

            swal("Message", "Upload complete. please click next button", 'success');

            $(".pnlAfter").addClass("notshowable");
            $(".pnlReLoad").removeClass("notshowable");

            saveToDatabase(downloadURL, items);
            //  console.log(downloadURL);

        });
    }
}


function saveToDatabase(_url, _items) {

    // console.log(_items.name);
    // console.log(_items.type);
    var _img = "";
    if ($("#imgSnapShot").attr('src') == undefined) {
        //skip
    }
    else {
        _img = $("#imgSnapShot").attr('src');
    }

    var user = firebase.auth().currentUser;


    if (user) {

        var d2 = new Date();
        var d = getCurrentTime();

        var newPostKey = firebase.database().ref().child("repository/" + user.uid + "/").push().key;

        firebase.database().ref("repository/" + user.uid + "/" + newPostKey).set({
            uid: user.uid,
            title: $("#txttitle").val() == "" ? _items.name : $("#txttitle").val(),
            type: _items.type,
            img: _img,
            url: _url,
            createdAt: d2.getTime(),
            eventdttm: d,
            reverseCreatedAt: -d2.getTime(),
            sharable: "N",
            price: 0
        }).then(function (result) {


        });;
    }


}



function getCurrentTime() {
    var t = "";

    var t1 = new Date();

    var yyyy = t1.getFullYear().toString();
    var mm = (t1.getMonth() + 1).toString();
    var dd = t1.getDate().toString();
    var hh = t1.getHours() < 10 ? "0" + t1.getHours() : t1.getHours();
    var min = t1.getMinutes() < 10 ? "0" + t1.getMinutes() : t1.getMinutes();
    var ss = t1.getSeconds() < 10 ? "0" + t1.getSeconds() : t1.getSeconds();


    t = yyyy + '/' + (mm[1] ? mm : "0" + mm[0]) + '/' + (dd[1] ? dd : "0" + dd[0]) + ' ' + hh + ':' + min + ":" + ss;

    return t;
}


/*
function readURL(input) {


    var items = input.files[0];
    var lg = input.files[0].length; // get length
    var _type = items.type;
    var _size = items.size;
    var _itemsize = Math.round(items.size / 1024 / 1024);

    _type = _type.toLowerCase();

    if (_size > 50000000) {
        //show an alert to the user
        swal("Oops!!", "Allowed file size exceeded. (Max. 50 MB), Current file size is [" + _itemsize + " MB]", 'error');
        $("#fileStatus").text("Fail");
    }
    else {
        //   console.log(items);
        // console.log(lg);

        $("#lblFileName").text(items.name);
        $("#lblFileType").text(items.type);

        var _itemsize2 = _itemsize.toLocaleString();
        $("#lblFileSize").text(_itemsize2 + " MB");

        $("#pnlBefore").addClass("notshowable");
        $(".pnlAfter").removeClass("notshowable");

        fr = new FileReader();
        fr.readAsArrayBuffer(items);
        fr.onloadend = function (evt) {
            // Do stuff on onload, use fr.result for contents of file

            var user = firebase.auth().currentUser;

            if (user) {

                var blob = new Blob([evt.target.result], { type: items.type });
                var storage = firebase.storage();
                var storageRef = firebase.storage().ref();

                var uploadTask = storageRef.child('data/' + user.uid + "/" + items.name).put(blob);

                // Register three observers:
                // 1. 'state_changed' observer, called any time the state changes
                // 2. Error observer, called on failure
                // 3. Completion observer, called on successful completion
                uploadTask.on('state_changed', function (snapshot) {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                    $("#txtProgress").text(Math.round(progress) + "%");
                    //console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            swal("Oops!!", "Upload is paused", 'error');
                            break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            console.log('Upload is running');
                            break;
                    }
                }, function (error) {
                    // Handle unsuccessful uploads
                    swal("Oops!!", error, 'error');
                }, function () {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    var downloadURL = uploadTask.snapshot.downloadURL;
                    $("#fileStatus").text("complete");
                    showChart();

                    swal("Message", "Upload complete. please click next button", 'success');

                    $(".pnlAfter").addClass("notshowable");
                    $(".pnlReLoad").removeClass("notshowable");
                    console.log(downloadURL);

                });

            }

        };

    }
}

*/

$("#btnFinish").click(function () {

    gotorep();

});


$("#btnRepository").click(function () {

    if ($("#my-video").children("source").attr('src') == undefined) {
        swal("Oops!!", 'Please select media first', 'error');
    }
    else {

        var user = firebase.auth().currentUser;
        if (user) {

            var d2 = new Date();
            var d = getCurrentTime();

            var newPostKey = firebase.database().ref().child("repository/" + user.uid + "/").push().key;

            firebase.database().ref("repository/" + user.uid + "/" + newPostKey).set({
                uid: user.uid,
                title: $("#lbltitle").text(),
                type: 'video/mp4',
                img: $("#lblimage").text(),
                url: $("#lblsrc").text(),
                createdAt: d2.getTime(),
                eventdttm: d,
                reverseCreatedAt: -d2.getTime(),
                sharable: "CC",
                price: 0,
                keywords: ""
            }).then(function (result) {
                swal("Message", "Save is complete", 'success');
            });;
        }


        /*
                var user = firebase.auth().currentUser;
                if (user) {
        
                    var d = getCurrentTime();
        
                    var uref = firebase.database().ref("paper/" + user.uid + "/" + v_key);
        
                    var upostData = {
                        eventdttm: d,
                        title: $("#" + v_idx + 'MTITLE' + v_key).val(),
                        subtitle: "",
                        writtenby: user.displayName,
                        profile: $("#" + v_idx + 'TXT' + v_key).val()
                    };
        
                    //console.log("v "+vc+" "+viewcount);
                    uref.update(upostData);
        
        
        
                }
                */
    }

});


$("#btnReloadFile").click(function () {
    /*
        if ($("#fileStatus").text() != "Fail") {
    
            $("#fileStatus").text("");
    
            $(".pnlReLoad").addClass("notshowable");
            $("#pnlBefore").removeClass("notshowable");
        }
        */

});




$("#btncandlf").click(function () {
    loadCandlf();
});


$("#btnresetpassword").click(function () {

    var auth = firebase.auth();
    var emailAddress = $("#txtresetpassword").val();

    if (emailAddress != "") {
        auth.sendPasswordResetEmail(emailAddress).then(function () {
            // Email sent.
            $('#modalResetPassword').modal('toggle');
        }, function (error) {
            // An error happened.
            swal("Oops!!", error.message, 'error');
        });
    }
});




$("#btnsharetocandlf").click(function () {

    var v_key = $("#lblrepkey").text();
    var user = firebase.auth().currentUser;
    if (user) {

        var ref = firebase.database().ref("repository/" + user.uid + "/" + v_key + "/");

        ref.once("value", function (data) {


            var uref = firebase.database().ref("candlf/" + v_key + "/");
            if ($("#chkshare").prop("checked")) {

                var d = getCurrentTime();

                var upostData = {
                    title: data.val().title,
                    type: data.val().type,
                    img: data.val().img,
                    url: data.val().url,
                    eventdttm: d,
                    keywords: "",
                    sid: user.uid,
                    price: $("#slist").selectpicker('val'),
                    count: parseInt($("#txtsavecount").text())
                };

                //console.log("v "+vc+" "+viewcount);
                uref.update(upostData);
            }
            else {

                uref.remove()
                    .then(function () {
                        console.log("Remove succeeded.");
                    })
                    .catch(function (error) {

                    });
            }

        });


    }


});



$("#btnnormal").click(function () {


    signUser($("#stxtemail").val(), $("#stxtpassword").val());

});




$("#btnnormal2").click(function () {


    swal("Sorry!!", "Not supported yet", 'error');

});


$("#btnreg").click(function () {

    createUser($("#stxtusername").val(), $("#stxtemail").val(), $("#stxtpassword").val());

    //createUser();
});



$("#btnreg2").click(function () {
    swal("Sorry!!", "Not supported yet", 'error');
});


$("#btngoogle2").click(function () {
    swal("Sorry!!", "Not supported yet", 'error');
});





$("#btngoogle").click(function () {

    var user = firebase.auth().currentUser;

    running();
    if (user) {

        //

    } else {
        // No user is signed in.
        // console.log("not logged in");

        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/plus.login');
        firebase.auth().signInWithPopup(provider).then(function (result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            console.log("connected");
            /*
                  if (user) {
                    // User is signed in.
                    console.log("google logged in");
                  //  setStatus("");
            
                    window.open('https://www.4parse.com/analysis/dashboard/', '_self', false);
                  } */
            // ...
        }).catch(function (error) {
            stopping();
            console.log("error");
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            console.log(errorMessage);
        });
    }
});



$("#btnfacebook").click(function () {

    var user = firebase.auth().currentUser;

    running();
    if (user) {

        //

    } else {
        // No user is signed in.
        // console.log("not logged in");

        // Sign in using a redirect.
        /*
        firebase.auth().getRedirectResult().then(function (result) {
            if (result.credential) {
                // This gives you a Google Access Token.
                var token = result.credential.accessToken;
            }
            var user = result.user;
            console.log("facebook connected1");
        }).catch(function (error) {
            */
        // Start a sign in process for an unauthenticated user.
        var provider = new firebase.auth.FacebookAuthProvider();
        provider.addScope('user_birthday');
        firebase.auth().signInWithPopup(provider).then(function (result) {
            // This gives you a Facebook Access Token.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            console.log("facebook connected2");
        }).catch(function (error) {
            stopping();
            console.log("error");
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            //console.log(errorMessage);
            //console.log(errorMessage);
            swal("Oops!!", errorMessage, 'error');
        });
        //  });
    }
});



$(".btnLogOut").click(function () {

    var v_msg1 = "Message";
    var v_msg2 = "You want to log out?";
    var v_msg3 = "Yes, Log out!";

    swal({
        title: v_msg1,
        text: v_msg2,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: v_msg3,
        closeOnConfirm: true
    },
        function () {

            firebase.auth().signOut().then(function () {

                console.log("log out");

                // The firebase.User instance:
                var providerId = "";
                firebase.auth().currentUser.unlink(providerId).then(function () {
                    // Auth provider unlinked from account
                    eraseCookie("susername");
                    eraseCookie("suserid");
                }, function (error) {
                    // An error happened
                });

                // window.location.reload();
                // Sign-out successful.
            }, function (error) {
                console.log("log out fail");
                // An error happened.
            });


        });

    //createUser();
});



function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    var encryptedAES = CryptoJS.AES.encrypt(cvalue, "66TADWD9Z86T65WDHZ85T65WECZ7ATAAW98Z7ETAEWDEZ77");

    document.cookie = cname + "=" + encryptedAES + "; " + expires;
    //console.log(document.cookie);
}


function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        //console.log("ca2 " + ca[i]);
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) {

            var decrypted = CryptoJS.AES.decrypt(c.substring(name.length, c.length), "66TADWD9Z86T65WDHZ85T65WECZ7ATAAW98Z7ETAEWDEZ77");
            return decrypted.toString(CryptoJS.enc.Utf8);

        }
    }
    return "";
}


function eraseCookie(cname) {
    setCookie(cname, "", -1);
}




//$("body").data("page", "frontpage");

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}