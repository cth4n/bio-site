const userid = config.userid;
let acts = [];

const getPfpUrl = (id, discrim, avatar) => {
    if (avatar && avatar !== null) {
        return `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`;
    }
    if (discrim && discrim !== null && discrim !== "0") {
        return `https://cdn.discordapp.com/embed/avatars/${parseInt(discrim) % 5}.png`;
    }
    return `https://cdn.discordapp.com/embed/avatars/${id.substr(id.length - 1)}.png`;
}

const load = () => {
    // init avatar in case it doesn't work
    const avaElem = document.getElementById("avatar");
    avaElem.src = getPfpUrl(userid, undefined, undefined);
    // view user button redirect
    const viewElem = document.getElementById("viewuser");
    viewElem.href = `https://discord.com/users/${userid}`;
    console.log("Page init");

    lanyard({
        userId: userid,
        socket: true,
        onPresenceUpdate: update
    });
    console.log("Lanyard init");
}

const update = data => {
    acts = data.activities;
    console.log(data);
    draw(data);
}

const draw = data => {
    if (title === "loading...") title = `${data.discord_user.username}'s discord status`;
    const displayNameElem = document.getElementById("display");
    displayNameElem.innerText = data.discord_user.global_name;

    const nameElem = document.getElementById("username");
    nameElem.innerText = data.discord_user.username;

    const statusElem = document.getElementById("status");

    const avaElem = document.getElementById("avatar");
    avaElem.src = getPfpUrl(data.discord_user.id, data.discord_user.discrim, data.discord_user.avatar);

    const userinfo = document.getElementById("user-info");
    const actsWrapper = document.querySelector(".activities");
    let toRemove = [];
    actsWrapper.childNodes.forEach(node => {
        if (acts.filter(act => act.id == node).length === 0) toRemove.push(node);
    });
    toRemove.forEach(node => actsWrapper.removeChild(node));

    acts.forEach(act => {

        if (act.type === 4) {
            if (act.state && act.emoji) {
                statusElem.innerText = `${act.emoji.name} ${act.state}`;
            } else if (!act.emoji) {
                statusElem.innerText = `${act.state}`;
            } else if (!act.state) {
                statusElem.innerText = `${act.emoji.name}`;
            } else {
                statusElem.innerText = "";
            }
        } else {
            const isSpotify = act.id === "spotify:1" && data.spotify;

            // create activity element
            const actElem = document.createElement("div");
            actElem.classList.add("activity");

            // create large image element
            const largeImageElem = document.createElement("img");
            largeImageElem.classList.add("largeimage");
            largeImageElem.src = isSpotify ? data.spotify.album_art_url : `https://media.discordapp.net/${act.assets.large_image.substring(3)}`;
            actElem.appendChild(largeImageElem);

            // create small image element
            if (!isSpotify) {
                const smallImageElem = document.createElement("img");
                smallImageElem.classList.add("smallimage");
                smallImageElem.src = `https://cdn.discordapp.com/app-assets/${act.application_id}/${act.assets.small_image}.png`;
                actElem.appendChild(smallImageElem);
            }

            // create name element
            const nameElem = document.createElement("div");
            nameElem.classList.add("name");
            nameElem.innerText = act.name;
            actElem.appendChild(nameElem);

            // create details element
            const detailsElem = document.createElement("div");
            detailsElem.classList.add("details");
            detailsElem.innerText = act.details;
            actElem.appendChild(detailsElem);

            // add activity element to wrapper
            actsWrapper.appendChild(actElem);
        }
    });

    userinfo.style.marginBottom = actsWrapper.children.length === 0 ? "0" : "1em";
}

// start the websocket to automatically fetch the new details on presence update
window.addEventListener("load", load);