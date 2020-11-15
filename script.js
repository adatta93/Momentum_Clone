$(document).ready(function() {
  setCurrentTime();
  var interval = (60 - new Date().getSeconds()) * 1000 + 5;
  setInterval(function() {
    setCurrentTime();
  }, interval);

  var username = getCookie("username");
  if (username) {
    $(".user-name").css("display", "none");
    var interest = getCookie("interest");
    // If Interest is already present in cookies
    if (interest) {
      // Hide Interest input
      $(".interest").css("display", "none");
      // Show selected Interest
      $(".interest-text").html(interest);
      // Show User name
      $(".greeting").html(`Hi, <span class="stored-name">${username}</span>`);
      // Fetch picture from cookies
      var pictureUrlListJson = getCookie("pictureUrlList");
      console.log("Cook ", pictureUrlListJson);
      // If no picture in cookies, fetch new picture
      if (!pictureUrlListJson) {
        newimage(interest);
        var pictureUrlList = JSON.parse(getCookie("pictureUrlList"));
        var randomIndex = Math.floor(Math.random() * 20) + 1;
        var picture_url = pictureUrlList[randomIndex];
      }
      var pictureUrlList = JSON.parse(pictureUrlListJson);
      var randomIndex = Math.floor(Math.random() * 20) + 1;
      var picture_url = pictureUrlList[randomIndex];
      
	  var pictureSourceList = JSON.parse(getCookie("pictureSourceList"));
	  var photo_by_name = getCookie("photo-by-name");
      var photo_by_url = getCookie("photo-by-url");

      $(".photoby").html(pictureSourceList[randomIndex]);
      $(".photoby").attr("href", pictureSourceList[randomIndex]);
      // Set the picture as background
      $(".image").css("background-image", `url(${picture_url})`);
      $(".change-interest").css("display", "block");
      $(".change-name").css("display", "block");
    } else {
      // If no interest present, ask user for interest
      $(".greeting").html(`What's your interst?`);
      $(".interest").css("display", "inline-block");
	  $(".image").css("filter", "blur(5px)");
    }
  } else {
    // If no username, hide interest, ask user for name
    $(".interest").css("display", "none");
    $(".user-name").css("display", "inline-block");
    $(".greeting").html(`What's your name?`);
	$(".image").css("filter", "blur(5px)");
  }
  // Enter Username
  $(".user-name").keyup(function(e) {
    if (e.which == 13) {
      var value = e.target.value;
      if (!value) return;
      $(".user-name").fadeOut(function() {
        $(".greeting").html(`Hi, ${value}`);
        var interest = getCookie("interest");
        if (!interest) {
          $(".interest").css("display", "inline-block");
        }
        $(".greeting").fadeIn(function() {
          setCookie("username", value, 365);
        });
      });
	  $(".image").css("filter", "blur(0px)");
	  $(".image").css("transform", "scale(1)");
    }
	if (e.which == 27) {
	  $(".image").css("filter", "blur(0px)");
	  $(".image").css("transform", "scale(1)");
	  var username = getCookie("username");
	  $(".greeting").html(`Hi, ${username}`);
	  $(".user-name").css("display", "none");
	}
  });
  // Enter image interest
  $(".interest").keyup(function(e) {
    if (e.which == 13) {
      var interest = e.target.value;
      if (!interest) return;
      newimage(interest);
      var username = getCookie("username");
      $(".interest").fadeOut(function() {
        $(".greeting").html(`Hi, ${username}`);
        $(".greeting").fadeIn(function() {
          setCookie("interest", interest, 365);
        });
      });
	  $(".image").css("filter", "blur(0px)");
	  $(".image").css("transform", "scale(1)");
    }
	if (e.which == 27) {
	  $(".image").css("filter", "blur(0px)");
	  $(".image").css("transform", "scale(1)");
	  var username = getCookie("username");
	  $(".greeting").html(`Hi, ${username}`);
	  $(".interest").css("display", "none");
	}
  });
  // Change Interest
  $(".change-interest").click(function() {
    $(".greeting").html(`What's your interest?`);
	$(".user-name").css("display", "none");
    $(".interest").css("display", "inline-block");
	$(".interest").focus();
	
	$(".image").css("filter", "blur(5px)");
	$(".image").css("transform", "scale(1.1)");
  });
  // Change name
  $(".change-name").click(function() {
    $(".greeting").html(`What's your name?`);
    $(".interest").css("display", "none");
    $(".user-name").css("display", "inline-block");
	$(".user-name").focus();

	$(".image").css("filter", "blur(5px)");
	$(".image").css("transform", "scale(1.1)");
  });
  // Fetch next 20 images
  $(".refresh-images").click(function() {
	let interest = $(".interest-text").html();
	let interestRefreshCount = getCookie("interest-refresh-count");
	interestRefreshCount++;
    newimage(interest, interestRefreshCount);
  });
});

function setCurrentTime() {
  var now = new Date();
  console.log(now);
  $(".time").html(
    appendZeroBefore(now.getHours()) + ":" + appendZeroBefore(now.getMinutes())
  );
  $(".date").html(
    now.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  );
}

function appendZeroBefore(val) {
  return val < 10 ? "0" + val : val;
}

const ACCESS_KEY =
  "baa2932e03c1069ffa4e6d5424afac276c3942158bcfbb8a2155cb6da38729db";

var i = 1;
function updatePictureTimer() {
  var pictureList = JSON.parse(getCookie("pictureUrlList"));
  console.log('A ',pictureList);
  $(".image").css("background-image", `url(${pictureList[i]})`);
  
  var pictureSourceList = JSON.parse(getCookie("pictureSourceList"));
  $(".photoby").html(pictureSourceList[i]);
  $(".photoby").attr("href", pictureSourceList[i]);
  i++;
  if (i == 20) {
    i = 0;
  }
}
setInterval(updatePictureTimer, 10 * 1000);

function newimage(keyword, pageNo=1) {
  if (!ACCESS_KEY) {
    alert("Please update your access key");
    return;
  }
  var url = `https://api.unsplash.com/search/photos?query=${keyword}&page=${pageNo}&per_page=20
			&orientation=landscape&client_id=${ACCESS_KEY}`;
  $.get(url, function(data) {
    var picture = data.results[0];
    var pictureUrlList = data.results.reduce(
      (acc, cur) => [...acc, cur.urls.regular],
      []
    );
    console.log(pictureUrlList);
	var pictureSourceList = data.results.reduce(
      (acc, cur) => [...acc, cur.links.html],
      []
    );

    var picture_url = picture.urls.regular;
    var photo_by_name = picture.user.name;
    var photo_by_url = picture.links.html;
    setCookie("picture", picture_url, 0.5);
    setCookie("pictureUrlList", JSON.stringify(pictureUrlList), 0.5);
    setCookie("pictureSourceList", JSON.stringify(pictureSourceList), 0.5);
    setCookie("photo-by-name", photo_by_name, 0.5);
    setCookie("photo-by-url", photo_by_url, 0.5);
	setCookie("interest-refresh-count", pageNo, 0.5);
    $(".interest-text").html(keyword);
    $(".photoby").html(photo_by_url);
    $(".photoby").attr("href", photo_by_url);
    $(".image").css("background-image", `url(${picture_url})`);
    $(".change-interest").css("display", "block");
    $(".change-name").css("display", "block");
  });
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
