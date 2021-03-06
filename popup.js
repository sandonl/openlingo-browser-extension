let image = document.getElementById("thumbnail");
let title = document.getElementById("title");
let link = document.getElementById("link-input");
let tags = document.getElementById("tag-input");
let submitButton = document.getElementById("submit-button");
let saved = document.getElementById("saved-success");
let understanding = document.getElementById("understanding");
let like = document.getElementById("like");
let learnerTag = document.getElementById("other-learners")

const resourceID = 9999

function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
};

document.addEventListener('DOMContentLoaded', function() {
    // onClick's logic below:
    submitButton.addEventListener('click', function() {
        save(resourceID);
    });
});


chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    let url = tabs[0].url;
    console.log(url);
    video_id = youtube_parser(url);
    updateLink(url);
    updateResourceImage(video_id);
    updateTitle(video_id);
    getRating()
});


function updateLink(url) {
    link.value = url;
};

function updateResourceImage(video_id) {
    image.src = `https://img.youtube.com/vi/${video_id}/hqdefault.jpg`;
};


function updateTitle(video_id) {
    const url = (`https://www.youtube.com/oembed?url=youtube.com/watch?v=${video_id}&format=json`);
    fetch(url).then(response => response.json()).then(json => {
        if (json.title) {
            title.innerHTML = json.title;
        };
    })
};


function save(resourceID) {
    resource_under = understanding.value;
    resource_like = like.value;   
    resource_link = link.value;
    resource_tags = tags.value;


    $.post('http://127.0.0.1:5000/extension_save', {
        resource_id: resourceID,
        resource_understanding: resource_under,
        resource_like: resource_like,
        resource_link: resource_link,
        resource_tags: resource_tags
    }).done(function(response) {
        saved.innerHTML = 'Saved!';
    }).fail(function(response) {
        saved.innerHTML = 'Unable to save';
    });

}


function getRating() {
    resource_link = link.value;
    $.post('http://127.0.0.1:5000/get_rating', {
        resource_link: resource_link
    }).done(function(response) {
        console.log(response)
        console.log(response.rating)
        if (response.success) {
            rating = response.rating
            learnerTag.innerHTML = 'Other intermediate 1 learners had ' + rating + '% average comprehension'
        } else {
            learnerTag.innerHTML = ""
        }
    }).fail(function(response){
        learnerTag.innerHTML = ""
    })
}
