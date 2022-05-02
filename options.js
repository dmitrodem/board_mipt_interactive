document.addEventListener("DOMContentLoaded", () => {
    let fieldset = document.querySelector("fieldset");
    browser.storage.sync.get("ban_list")
        .then((obj) =>
            obj.ban_list.forEach((username) => {
                let div = document.createElement("div");
                let input = document.createElement("input");
                let label = document.createElement("label");
                input["type"] = "checkbox";
                input["id"] = username;
                input["name"] = username;
                label["for"] = username;
                label.textContent = username;
                div.appendChild(input);
                div.appendChild(label);
                fieldset.appendChild(div);
            }));
    document.querySelector("form").addEventListener("submit", (e) => {
        browser.storage.sync.get("ban_list")
            .then((obj) => {
                let ban_set = new Set(obj.ban_list);
                document.querySelectorAll("input").forEach((input) => {
                    if (input.checked) {
                        ban_set.delete(input["name"]);
                    }
                });
                obj.ban_list = Array.from(ban_set);
                browser.storage.sync.set(obj);
            });
    });
});
