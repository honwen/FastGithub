// ==UserScript==
// @icon          https://github.githubassets.com/favicon.ico
// @name          FastGithub 镜像加速访问、克隆和下载
// @namespace     honwen.FastGithub
// @author        honwen
// @homepageURL   https://github.com/honwen/FastGithub
// @supportURL    https://github.com/honwen/FastGithub/issues
// @license       MIT License
// @description   镜像访问GitHub，极速Clone、Release/Raw/Zip加速；十几个站点可供选择；前往项目Github仓库查看免费搭建Github镜像站点方法
// @include       *://github.com/*
// @include       *://github*
// @include       *://hub.fastgit.org/*
// @include       *://hub.fastgit.xyz/*
// @require       https://unpkg.zhimg.com/jquery@3.6.0/dist/jquery.js
// @version       1.6.8
// @run-at        document-end
// ==/UserScript==

(function () {
  //=true为启用，=false为禁用
  var clone = true;
  // var clone = false;
  var depth = true;
  // var depth = false;
  var Setting = "";
  if (clone) {
    Setting += "git clone ";
    if (depth) {
      Setting += "--depth=1 ";
    }
  }

  var MirrorUrl = new Array(); //["Url", "Name", "Tip"]
  MirrorUrl[0] = [
    "https://github.com.cnpmjs.org",
    "Cnpmjs",
    "由cnpmjs.org提供",
  ];
  MirrorUrl[1] = [
    "https://hub.fastgit.xyz",
    "FastGit",
    "由KevinZonda推动的FastGit项目，请仔细甄别",
  ];
  MirrorUrl[2] = [
    "https://github.wuyanzheshui.workers.dev",
    "CF加速 1",
    "每日10万次调用上限，由wuyanzheshui提供",
  ];
  MirrorUrl[3] = ["https://github.bajins.com", "Bajins", "Bajins的个人站点"];
  MirrorUrl[4] = ["https://download.fastgit.org", "FastGit", MirrorUrl[1][2]];
  MirrorUrl[5] = [
    "https://github.honwen.workers.dev",
    "CF加速 2",
    "每日10万次调用上限，由honwen提供",
  ];
  MirrorUrl[6] = [
    "https://gitclone.com/github.com",
    "GitClone",
    "GitHub缓存加速网站，1元开会员尽享极速",
  ];
  MirrorUrl[7] = [
    "git@git.zhlh6.cn:",
    "加速你的Github",
    "利用ucloud提供的GlobalSSH",
  ];
  MirrorUrl[8] = [
    "https://github-speedup.laiczhang.com",
    "laiczhang",
    "laiczhang的个人站点",
  ];
  MirrorUrl[9] = [
    "https://cdn.jsdelivr.net/gh",
    "jsDelivr",
    "项目当前分支总文件大小不可超过 50MB",
  ];
  MirrorUrl[10] = [
    "https://ghproxy.com/https://github.com",
    "IOIOX.KR",
    "CN2 GIA 线路",
  ];
  MirrorUrl[20] = [
    "https://mirror.ghproxy.com/https://github.com",
    "IOIOX.JP",
    "CN2 GIA 线路",
  ];
  MirrorUrl[11] = ["https://raw.fastgit.org", "FastGit", MirrorUrl[1][2]];
  MirrorUrl[12] = [
    "https://cdn.staticaly.com/gh",
    "Statically",
    "只能浏览图片和源代码文件，文件大小限制为30MB",
  ];
  // MirrorUrl[13] = ["https://github.iapk.cc", "IAPK", "IAPK工具箱·Github下载器"]
  MirrorUrl[14] = [
    "https://iapk.cc/github?url=https://github.com",
    "IAPK",
    "IAPK工具箱·Github下载器",
  ];
  MirrorUrl[15] = [
    "https://gh.haval.gq",
    "CF加速 3",
    "每日10万次调用上限，由Ecalose提供",
  ];
  MirrorUrl[16] = [
    "https://raw-gh.gcdn.mirr.one",
    "G-Core",
    "俄罗斯 G-Core Labs CDN",
  ];
  //添加对应索引即可使用
  var CloneSet = [1, 10];
  var MirrorSet = [1];
  var DownloadSet = [4, 10, 20];
  var RawSet = [10, 20];

  //其他
  var CloneList = addCloneList();
  var OtherList = addOtherList();
  var isPC = IsPC();
  run();
  $(document).on("pjax:success", function () {
    $("#mirror-menu").remove();
    run();
  });

  function run() {
    addMenus(CloneList + addBrowseList() + OtherList);
    if (location.pathname.split("/")[3] == "releases") addReleasesList();
    if (isPC) addDownloadZip();
    addRawList();
  }
  /**
   * 添加Raw列表
   */
  function addRawList() {
    $("#raw-url").each(function () {
      var href = $(this).attr("href");
      rawHtml(11, MirrorUrl[11][0] + href.replace("/raw", ""));
      RawSet.forEach((element) => {
        rawHtml(element, MirrorUrl[element][0] + href);
      });
      rawHtml(16, MirrorUrl[16][0] + href.replace("/raw", ""));
      rawHtml(9, MirrorUrl[9][0] + href.replace("/raw/", "@"));
      rawHtml(12, MirrorUrl[12][0] + href.replace("/raw", ""));

      function rawHtml(element, Url) {
        var span = $("#raw-url").clone().removeAttr("id");
        span.attr({
          href: Url,
          title: MirrorUrl[element][2],
          target: "_blank",
        });
        span.text(MirrorUrl[element][1]);
        $("#raw-url").before(span);
      }
    });
  }

  /**
   * Fast Download ZIP
   */
  function addDownloadZip() {
    $("a[data-open-app='link']").each(function () {
      var span = $(`<li class="Box-row p-0"></li>`);
      var href = $(this).attr("href");
      var clone = $(this)
        .clone()
        .removeAttr("data-hydro-click data-hydro-click-hmac data-ga-click");
      clone.addClass("Box-row Box-row--hover-gray");
      DownloadSet.forEach((element) => {
        var span1 = clone.clone();
        span1.attr({
          href: MirrorUrl[element][0] + href,
          title: MirrorUrl[element][2],
        });
        span1.html(
          span1
            .html()
            .replace("Download ZIP", `Download ZIP(${MirrorUrl[element][1]})`)
        );
        span = span.clone().append(span1);
      });
      $(this).parent().after(span);
    });
  }
  /**
   * 添加Releases列表
   * refer: https://github.com/XIU2/UserScript/blob/c2f4cdaf23ea8d3d2ae1e089fb6c1bcbe4f8956a/GithubEnhanced-High-Speed-Download.user.js#L151
   */
  function addReleasesList() {
    let html = document.querySelectorAll(".Box-footer");
    if (html.length == 0) return;
    let divDisplay = "margin-left: -90px;";
    if (document.documentElement.clientWidth > 755) {
      divDisplay = "margin-top: -3px;margin-left: 8px;display: inherit;";
    } // 调整小屏幕时的样式
    for (const current of html) {
      if (current.querySelector(".XIU2-RS")) continue;
      current.querySelectorAll("li.Box-row a").forEach(function (_this) {
        _this.parentElement.nextElementSibling.insertAdjacentHTML(
          "beforeend",
          `<div class="XIU2-RS" style="${divDisplay}">` +
            downloadHref(_this.href) +
            "</div>"
        );

        function downloadHref(href) {
          var span = "";
          DownloadSet.forEach((element) => {
            span += `<a class="flex-1 btn btn-outline get-repo-btn BtnGroup-item"
                        style="float: none; border-color: var(--color-btn-outline-text);"
                        rel="nofollow"
                        href="${
                          MirrorUrl[element][0] +
                          href.replace("https://github.com", "")
                        }"
                        title="${MirrorUrl[element][2]}">${
              MirrorUrl[element][1]
            }</a>`;
          });
          return span;
        }
      });
    }
  }
  /**
   * 检测是否为PC端
   */
  function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = [
      "Android",
      "iPhone",
      "SymbianOS",
      "Windows Phone",
      "iPad",
      "iPod",
    ];
    var flag = true;
    const len = Agents.length;
    for (var v = 0; v < len; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false;
        break;
      }
    }
    return flag;
  }
  /**
   * 添加菜单列表
   */
  function addMenus(info) {
    // $("div.flex-auto.min-width-0.width-fit.mr-3")
    $("h1.wb-break-word").append(info);
  }
  /**
   * 添加克隆列表
   */
  function addCloneList() {
    var href = window.location.href.split("/");
    var git = href[3] + "/" + href[4] + ".git";
    var info = `
<details class="details-reset details-overlay mr-0 mb-0" id="mirror-menu">
  <summary class="btn  ml-2 btn-primary" data-hotkey="m" title="打开列表" aria-haspopup="menu" role="button">
    <span class="css-truncate-target" data-menu-button="">克隆与镜像</span>
    <span class="dropdown-caret"></span>
  </summary>

  <details-menu class="SelectMenu SelectMenu--hasFilter" role="menu">
    <div class="SelectMenu-modal" style="width: 400px;">

        <div role="tabpanel" class="flex-column flex-auto overflow-auto" tabindex="0">
          <div class="SelectMenu-list" data-filter-list="">
            <div class="btn-block"
              style="padding: 4px;background-color: #ffffdd;color: #996600;" role="alert">
              clone、depth命令的插入可手动编辑代码关闭
            </div>
            <div class="btn-block flash-error"
              style="padding: 4px;color: #990000;" role="alert">
              请不要在镜像网站登录账号，若因此造成任何损失本人概不负责
            </div> `;
    //克隆列表
    CloneSet.forEach((element) => {
      info += cloneHtml(
        Setting + MirrorUrl[element][0] + "/" + git,
        MirrorUrl[element][1]
      );
    });
    info += cloneHtml(Setting + MirrorUrl[7][0] + git, MirrorUrl[7][1]);
    info += cloneHtml(
      "git remote set-url origin https://github.com/" + git,
      "还原GitHub仓库地址"
    );
    function cloneHtml(Url, Tip) {
      return `
<div class="input-group" title="${Tip}">
  <input type="text" class="form-control input-monospace input-sm" value="${Url}" readonly=""
    data-autoselect="">
  <div class="input-group-button">
    <clipboard-copy value="${Url}" class="btn btn-sm"><svg class="octicon octicon-clippy"
        viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
        <path fill-rule="evenodd"
          d="M5.75 1a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-3a.75.75 0 00-.75-.75h-4.5zm.75 3V2.5h3V4h-3zm-2.874-.467a.75.75 0 00-.752-1.298A1.75 1.75 0 002 3.75v9.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-9.5a1.75 1.75 0 00-.874-1.515.75.75 0 10-.752 1.298.25.25 0 01.126.217v9.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-9.5a.25.25 0 01.126-.217z">
        </path>
      </svg></clipboard-copy>
  </div>
</div>`;
    }
    return info;
  }
  /**
   * 添加镜像浏览列表
   */
  function addBrowseList() {
    var info = ``;
    var href = window.location.href.split("/");
    var path = window.location.pathname;
    MirrorSet.forEach((element) => {
      info += listHtml(
        MirrorUrl[element][0] + path,
        `镜像浏览(${MirrorUrl[element][1]})`,
        MirrorUrl[element][2]
      );
    });
    if (
      href.length == 5 ||
      path.includes("/tree/") ||
      path.includes("/blob/")
    ) {
      var Html =
        MirrorUrl[9][0] + path.replace("/tree/", "@").replace("/blob/", "@");
      if (!path.includes("/blob/")) {
        Html += "/";
      }
      info += listHtml(Html, `镜像浏览(${MirrorUrl[9][1]})`, MirrorUrl[9][2]);
    }
    if (location.hostname != "github.com") {
      info += listHtml(`https://github.com${path}`, "返回GitHub");
    }
    return info;
  }

  /**
   * 添加其他列表
   */
  function addOtherList() {
    var info = `
          </div>
        </div>
        <div role="tabpanel" class="flex-column flex-auto overflow-auto"
          tabindex="0" hidden="">
          <div class="SelectMenu-list">
            `;
    info += `</div>
        </div>
    </div>
  </details-menu>
</details>`;
    return info;
  }
  function listHtml(Url, Name, Tip = "") {
    return `
<a class="SelectMenu-item"
    href="${Url}" target="_blank"
    title="${Tip}" role="menuitemradio"
    aria-checked="false" rel="nofollow">
  <span class="css-truncate css-truncate-overflow" style="text-align:center;">
    ${Name}
  </span>
</a>`;
  }
})();
