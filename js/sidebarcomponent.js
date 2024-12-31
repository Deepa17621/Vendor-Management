class SidebarComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.sideBar();
    }

    sideBar() {
        let shadow = this.attachShadow({ mode: "open" });

        const modules = {
            "Admin": "/index.html",
            "Vendor": "/html/vendor.html",
            "Services": "/html/services.html",
            "Ratings-And-Reviews": "/html/ratingsreviews.html",
            "Performance-Metrics": "/html/performance.html",
            "Contract-Details": "/html/contracts.html"
        };

        let sidebarWrapper = document.createElement("div");
        sidebarWrapper.setAttribute("class", "side-bar-container");

        let titleBar = document.createElement("div");
        titleBar.setAttribute("class", "title-bar");
        titleBar.textContent = "V M S";

        let ul = document.createElement("ul");
        ul.setAttribute("class", "modules-ul");

        sidebarWrapper.appendChild(titleBar);

        for (const moduleName in modules) {
            let moduleContainer = document.createElement("li");
            moduleContainer.setAttribute("class", "modules-li");

            let anchor = document.createElement("a");
            anchor.setAttribute("href", modules[moduleName]);
            anchor.setAttribute("class", "anchor-module");
            anchor.textContent = moduleName;

            moduleContainer.appendChild(anchor);
            ul.appendChild(moduleContainer);
        }

        sidebarWrapper.appendChild(ul);
        shadow.append(sidebarWrapper);

        let styleTag = document.createElement("style");
        styleTag.innerHTML = this.style();
        shadow.append(styleTag);
    }

    style() {
        return `@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Varela+Round&display=swap');
        * {
            font-family: "Lato", serif;
            margin: 0;
            padding: 0;
            color:white;
        }
        .side-bar-container {
            width: 200px;
            height: 100%;
            background-color: green;
        }
        .title-bar {
            width: 95%;
            padding: 0.7rem;
            color: white;
            font-weight: 900;
            text-align:center;
            font-size:x-large;
        }
        .modules-ul {
            width: 100%;
        }
        .modules-li {
            width: 90%;
            padding: 0.7rem 0.6rem;
            border-radius: 0.5rem;
            text-align: left;
            font-weight:500;
            transition: background 0.4s;
        }
        .modules-li:hover {
            background-color: grey;
            cursor: pointer;
        }
        .anchor-module {
            display: inline-block;
            text-decoration: none;
            width: 100%;
            height: 100%;
        }
        `;
    }
}

customElements.define("custom-sidebar", SidebarComponent);
