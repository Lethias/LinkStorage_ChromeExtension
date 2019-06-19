const url = 'http://localhost:3000';

const tabs = document.getElementById("tabs");
const tab2 = document.getElementById('tab2');
const tab3 = document.getElementById('tab3');
const errortab2 = document.getElementById('errortab2');
const errortab3 = document.getElementById('errortab3');
const errortab4 = document.getElementById('errortab4');
const ulist = document.getElementById('ulist');

const loginform = document.getElementById('loginform');
const loginsubmit = document.getElementById('loginsubmit');
const loginh4 = document.getElementById('loginh4');

const registerform = document.getElementById('registerform');
const registersubmit = document.getElementById('registersubmit');
const registerp = document.getElementById('registerp');
const registermodal = document.getElementById('registermodal');

const searchurldesccontent = document.getElementById('searchurldesccontent');
const searchsubmiturldesc = document.getElementById('searchsubmiturldesc');
const searchformurldesc = document.getElementById('searchformurldesc');

const searchtagscontent = document.getElementById('searchtagscontent');
const searchsubmittags = document.getElementById('searchsubmittags');
const searchformtags = document.getElementById('searchformtags');

const searchchipstags = document.getElementById('searchchipstags');

const modalsinside = document.getElementById('modalsinside');

const jwt = localStorage.getItem('token');
const constructedJWT = 'Bearer ' + jwt;

// Initial content load

document.addEventListener('DOMContentLoaded', function () {
    loadContent();
    M.AutoInit();
});

// Reload Content when Storage is clicked

document.getElementById('storage').addEventListener('click', function () {
    loadContent();
});

// Extend Body when Regisration opens / Set to normal when closes

document.getElementById('modaltrigger').addEventListener('click', function () {
    document.getElementById('body').style.height = "440px";
});

document.getElementById('registercancel').addEventListener('click', function () {
    let registermodalinstance = M.Modal.getInstance(registermodal);
    registermodalinstance.close();
    document.getElementById('body').style.height = "";
});

// Login eventListener

loginsubmit.addEventListener('click', function () {
    if (loginform.checkValidity()) {
        let mail = document.getElementById('loginemail').value;
        let password = document.getElementById('loginpassword').value;
        let body = JSON.stringify({email: mail, password: password});

        let request = new XMLHttpRequest();
        request.open('POST', url + '/user/login');
        request.setRequestHeader("Content-Type", "application/json");

        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                let data = JSON.parse(this.response);
                localStorage.setItem('token', data.token);
                $("#loginform")[0].reset();
                window.location.reload();
            } else {
                loginh4.setAttribute('class', 'red-text');
                loginh4.textContent = 'Wrong Email or Password';
            }
        };
        request.send(body);
    }
});

// Register eventListener

registersubmit.addEventListener('click', function () {
    if (registerform.checkValidity()) {
        let mail = document.getElementById('registeremail').value;
        let password = document.getElementById('registerpassword').value;
        let body = JSON.stringify({email: mail, password: password});

        let request = new XMLHttpRequest();
        request.open('POST', url + '/user/register');
        request.setRequestHeader("Content-Type", "application/json");

        request.onload = function () {
            if (request.status === 409) {
                registerp.setAttribute('class', 'red-text');
                registerp.textContent = 'This Email has already been taken. Please choose another one.';
            } else if (request.status >= 200 && request.status < 400) {
                registerp.setAttribute('class', 'teal-text');
                registerp.textContent = 'You have been registered and will be redirected soon.';
                let registermodalinstance = M.Modal.getInstance(registermodal);
                setTimeout(function () {
                    registermodalinstance.close();
                    registerp.textContent = '';
                    document.getElementById('body').style.height = '';
                }, 2000);
                $("#registerform")[0].reset();
            } else {
                registerp.setAttribute('class', 'red-text');
                registerp.textContent = 'The Email or Password does not match the requirements.';
            }
        };
        request.send(body);
    }
});

// Loading Storage when user is logged in

function loadContent() {
    let request = new XMLHttpRequest();
    request.open('GET', url + '/user/categories');
    request.setRequestHeader('Authorization', constructedJWT);
    request.onload = function () {

        if (request.status >= 200 && request.status < 400) {
            tab2.removeChild(tab2.firstChild);
            while (ulist.firstChild) {
                ulist.removeChild(ulist.firstChild);
            }

            let data = JSON.parse(this.response);

            loginh4.setAttribute('class', 'green-text');
            loginh4.textContent = 'You are logged in';
            ulist.style.display = 'block';

            // Setup for Category Button

            const firstdiv = document.createElement('div');
            const addcategorybutton = document.createElement('a');

            addcategorybutton.setAttribute('id', 'addcategory');
            addcategorybutton.setAttribute('class', 'waves-effect waves-light btn');
            addcategorybutton.textContent = 'Add Category';

            firstdiv.appendChild(addcategorybutton);
            tab2.appendChild(firstdiv);
            tab2.insertBefore(firstdiv, tab2.firstChild);

            // Form setup for adding categories

            const hiddendivcategory = document.createElement('div');
            const addcatform = document.createElement('form');
            const inputdivname = document.createElement('div');
            const inputdivdesc = document.createElement('div');
            const categoryname = document.createElement('input');
            const categorydesc = document.createElement('input');
            const categorynamelabel = document.createElement('label');
            const categorydesclabel = document.createElement('label');
            const categorynamevalidateerror = document.createElement('span');
            const categorydescvalidateerror = document.createElement('span');
            const categorysubmitbutton = document.createElement('a');

            addcatform.setAttribute('id', 'categoryform');
            inputdivname.setAttribute('class', 'input-field');
            inputdivdesc.setAttribute('class', 'input-field');
            categoryname.setAttribute('class', 'validate');
            categoryname.setAttribute('type', 'text');
            categoryname.setAttribute("maxlength", '30');
            categoryname.setAttribute('id', 'categoryname');
            categorydesc.setAttribute('class', 'validate');
            categorydesc.setAttribute('type', 'text');
            categorydesc.setAttribute("maxlength", '80');
            categorydesc.setAttribute('id', 'categorydesc');
            categorynamevalidateerror.setAttribute('class', 'helper-text');
            categorynamevalidateerror.setAttribute('data-error', 'Please insert a name for the category. Max length is 30 chars');
            categorydescvalidateerror.setAttribute('class', 'helper-text');
            categorydescvalidateerror.setAttribute('data-error', 'Please insert a description. Max length is 80 chars');
            categorysubmitbutton.setAttribute('class', 'waves-effect waves-light btn');

            categoryname.required = true;
            categorydesc.required = true;

            categorynamelabel.setAttribute('for', 'categoryname');
            categorydesclabel.setAttribute('for', 'categorydesc');
            categorynamelabel.textContent = 'Name';
            categorydesclabel.textContent = 'Description';
            categorysubmitbutton.textContent = 'Submit Category';

            hiddendivcategory.style.display = 'none';

            firstdiv.appendChild(hiddendivcategory);
            hiddendivcategory.appendChild(addcatform);
            addcatform.appendChild(inputdivname);
            addcatform.appendChild(inputdivdesc);
            addcatform.appendChild(categorysubmitbutton);
            inputdivname.appendChild(categoryname);
            inputdivname.appendChild(categorynamelabel);
            inputdivname.appendChild(categorynamevalidateerror);
            inputdivdesc.appendChild(categorydesc);
            inputdivdesc.appendChild(categorydesclabel);
            inputdivdesc.appendChild(categorydescvalidateerror);

            // Button for hiding/showing form

            addcategorybutton.addEventListener('click',
                function () {
                    if (hiddendivcategory.style.display === 'none') {
                        hiddendivcategory.style.display = 'block';
                        this.setAttribute('class', 'waves-effect waves-light btn orange');
                        this.textContent = 'Hide';
                    } else {
                        hiddendivcategory.style.display = 'none';
                        this.setAttribute('class', 'waves-effect waves-light btn');
                        this.textContent = 'Add Category';
                    }
                });

            // Submit button with API post to add Category

            categorysubmitbutton.addEventListener('click',
                function () {
                    if (addcatform.checkValidity()) {
                        const categoryname = document.getElementById('categoryname').value;
                        const categorydesc = document.getElementById('categorydesc').value;
                        const body = JSON.stringify({name: categoryname, description: categorydesc});

                        let request = new XMLHttpRequest();
                        request.open('POST', url + '/user/categories');
                        request.setRequestHeader('Authorization', constructedJWT);
                        request.setRequestHeader("Content-Type", "application/json");

                        request.onload = function () {
                            if (request.status >= 200 && request.status < 400) {
                                $("#categoryform")[0].reset();
                                loadContent();
                            } else {
                                console.log('Fehler bei Kategorieerstellung');
                            }
                        };
                        request.send(body);
                    }
                });

            // Setup Collapsible Header in loop

            data.forEach(category => {

                // Form setup for adding Links

                const hiddendivlink = document.createElement('div');
                const addlinkform = document.createElement('form');
                const inputdivlinkname = document.createElement('div');
                const inputdivlinkdesc = document.createElement('div');
                const linkname = document.createElement('input');
                const linkdescription = document.createElement('input');
                const linknamelabel = document.createElement('label');
                const linkdescriptionlabel = document.createElement('label');
                const linknamevalidateerror = document.createElement('span');
                const linkdescvalidateerror = document.createElement('span');
                const linksubmitbutton = document.createElement('a');
                const inputdivlinkchips = document.createElement('div');
                const linkchips = document.createElement('input');

                addlinkform.setAttribute('id', category._id + 'form');
                inputdivlinkname.setAttribute('class', 'input-field');
                inputdivlinkdesc.setAttribute('class', 'input-field');
                linkname.setAttribute('class', 'validate');
                linkname.setAttribute('type', 'url');
                linkname.setAttribute('id', category._id + 'name');
                linkdescription.setAttribute('class', 'validate');
                linkdescription.setAttribute('type', 'text');
                linkdescription.setAttribute("maxlength", '100');
                linkdescription.setAttribute('id', category._id + 'description');
                linknamevalidateerror.setAttribute('class', 'helper-text');
                linknamevalidateerror.setAttribute('data-error', 'Please insert a valid URL');
                linkdescvalidateerror.setAttribute('class', 'helper-text');
                linkdescvalidateerror.setAttribute('data-error', 'Please insert a description. Max length is 100 chars');
                linksubmitbutton.setAttribute('class', 'waves-effect waves-light btn');
                linknamelabel.setAttribute('for', category._id + 'name');
                linkdescriptionlabel.setAttribute('for', category._id + 'description');

                inputdivlinkchips.setAttribute('class', 'chips chips-placeholder input-field');
                inputdivlinkchips.setAttribute('id', category._id + 'tagsfield');
                linkchips.setAttribute('class', 'input');
                linkchips.setAttribute('id', category._id + 'tags');

                let chip = M.Chips.init(inputdivlinkchips, {
                    placeholder: 'Enter a Tag',
                    secondaryPlaceholder: '+Tag'
                });

                linkname.required = true;
                linkdescription.required = true;

                linknamelabel.textContent = 'Link / URL';
                linkdescriptionlabel.textContent = 'Description';
                linksubmitbutton.textContent = 'Submit Link';

                hiddendivlink.style.display = 'none';

                hiddendivlink.appendChild(addlinkform);
                addlinkform.appendChild(inputdivlinkname);
                addlinkform.appendChild(inputdivlinkdesc);
                addlinkform.appendChild(inputdivlinkchips);
                addlinkform.appendChild(linksubmitbutton);
                inputdivlinkname.appendChild(linkname);
                inputdivlinkname.appendChild(linknamelabel);
                inputdivlinkname.appendChild(linknamevalidateerror);
                inputdivlinkdesc.appendChild(linkdescription);
                inputdivlinkdesc.appendChild(linkdescriptionlabel);
                inputdivlinkdesc.appendChild(linkdescvalidateerror);
                inputdivlinkchips.appendChild(linkchips);

                // Adding categories to content

                const listitem = document.createElement('li');
                const collapseheader = document.createElement('div');
                const rowdiv = document.createElement('div');
                const coldivone = document.createElement('div');
                const coldivtwo = document.createElement('div');
                const title = document.createElement('span');
                const description = document.createElement('span');
                const addlinkbutton = document.createElement('a');
                const deletecategorybutton = document.createElement('a');
                const collapsebody = document.createElement('div');

                collapseheader.setAttribute('class', 'collapsible-header blue-grey darken-3 white-text');
                rowdiv.setAttribute('class', 'row');
                coldivone.setAttribute('class', 'col s12');
                coldivtwo.setAttribute('class', 'col s12');
                title.setAttribute('class', 'biggertext');
                collapsebody.setAttribute('class', 'collapsible-body noMargin noPadding');
                addlinkbutton.setAttribute('class', 'waves-effect waves-light btn');
                addlinkbutton.setAttribute('id', category._id + 'addbtn');
                deletecategorybutton.setAttribute('class', 'waves-effect waves-light modal-trigger btn red right');
                deletecategorybutton.setAttribute('id', category._id + 'delcatbtn');
                deletecategorybutton.setAttribute('data-target', category._id + 'modal');

                ulist.appendChild(listitem);
                listitem.appendChild(collapseheader);
                listitem.appendChild(collapsebody);
                collapseheader.appendChild(rowdiv);
                collapsebody.appendChild(addlinkbutton);
                collapsebody.appendChild(deletecategorybutton);
                collapsebody.appendChild(hiddendivlink);
                rowdiv.appendChild(coldivone);
                rowdiv.appendChild(coldivtwo);
                coldivone.appendChild(title);
                coldivtwo.appendChild(description);

                title.textContent = category.name;
                description.textContent = category.description;
                addlinkbutton.textContent = 'Add link';
                deletecategorybutton.textContent = 'Delete Category';

                // Show/Hide Add Link button

                addlinkbutton.addEventListener('click',
                    function () {
                        if (hiddendivlink.style.display === 'none') {
                            hiddendivlink.style.display = 'block';
                            this.setAttribute('class', 'waves-effect waves-light btn orange');
                            this.textContent = 'Hide';
                        } else {
                            hiddendivlink.style.display = 'none';
                            this.setAttribute('class', 'waves-effect waves-light btn');
                            this.textContent = 'Add Link';
                        }
                    });


                // Delete category button with API post to delete category and links

                deletecategorybutton.addEventListener('click', function () {
                    const modaldiv = document.createElement('div');
                    const modalcontentdiv = document.createElement('div');
                    const modalcontenth5 = document.createElement('h5');
                    const modalcontentp = document.createElement('p');
                    const modalfooterdiv = document.createElement('div');
                    const confirmdeletecategory = document.createElement('a');
                    const canceldeletecategory = document.createElement('a');

                    modaldiv.setAttribute('class', 'modal');
                    modaldiv.setAttribute('id', category._id + 'modal');
                    modalcontentdiv.setAttribute('class', 'modal-content');
                    modalfooterdiv.setAttribute('class', 'modal-footer');
                    confirmdeletecategory.setAttribute('class', 'waves-effect waves-red btn-flat red white-text');
                    canceldeletecategory.setAttribute('class', 'modal-close waves-effect waves-teal lighten-2 btn-flat teal lighten-2 white-text');

                    modalsinside.appendChild(modaldiv);
                    modaldiv.appendChild(modalcontentdiv);
                    modaldiv.appendChild(modalfooterdiv);
                    modalcontentdiv.appendChild(modalcontenth5);
                    modalcontentdiv.appendChild(modalcontentp);
                    modalfooterdiv.appendChild(confirmdeletecategory);
                    modalfooterdiv.appendChild(canceldeletecategory);

                    modalcontenth5.textContent = 'Delete category ' + category.name + ' ?';
                    modalcontentp.textContent = 'Do you really want to delete this category ? All containing links will be deleted as well.';
                    confirmdeletecategory.textContent = 'Delete';
                    canceldeletecategory.textContent = 'Cancel';

                    const modalinstance = M.Modal.init(modaldiv);

                    confirmdeletecategory.addEventListener('click', function () {
                        let request = new XMLHttpRequest();
                        request.open('DELETE', url + '/user/categories/' + category._id);
                        request.setRequestHeader('Authorization', constructedJWT);
                        request.setRequestHeader("Content-Type", "application/json");

                        request.onload = function () {
                            if (request.status >= 200 && request.status < 400) {
                                loadContent();
                            } else {
                                console.log('Fehler bei Linkerstellung');
                            }
                        };
                        request.send();
                        modalinstance.destroy();
                    });

                    canceldeletecategory.addEventListener('click', function () {
                        modalinstance.destroy();
                        while (modalsinside.firstChild) {
                            modalsinside.removeChild(modalsinside.firstChild);
                        }
                    });
                });

                // Submit button with API post to add Link

                linksubmitbutton.addEventListener('click',
                    function () {
                        if (addlinkform.checkValidity()) {
                            const linkname = document.getElementById(category._id + 'name').value;
                            const linkdescription = document.getElementById(category._id + 'description').value;
                            const tags = [];

                            const instance = M.Chips.getInstance($('#' + category._id + 'tagsfield'));
                            const taginput = instance.chipsData;
                            const taginputlength = taginput.length;
                            console.log(taginputlength);

                            for (let a = 0; a < taginput.length; a++) {
                                tags.push(taginput[a].tag);
                            }
                            for (let b = 0; b < taginputlength; b++) {
                                instance.deleteChip();
                            }

                            const createdAt = formatDate();
                            const body = JSON.stringify({
                                link: linkname,
                                linkdescription: linkdescription,
                                createdAt: createdAt,
                                tags: tags
                            });

                            let request = new XMLHttpRequest();
                            request.open('POST', url + '/user/categories/' + category._id + '/links');
                            request.setRequestHeader('Authorization', constructedJWT);
                            request.setRequestHeader("Content-Type", "application/json");

                            request.onload = function () {
                                if (request.status >= 200 && request.status < 400) {
                                    const deletehelper = JSON.parse(this.response);
                                    const deletehelperextended = deletehelper.link;

                                    const divbody = document.createElement('div');
                                    const card = createCard(category._id, deletehelperextended, true);

                                    divbody.setAttribute('class', 'collapsible-body noMargin noPadding');

                                    listitem.appendChild(divbody);
                                    divbody.appendChild(card);

                                    hiddendivlink.style.display = 'none';
                                    divbody.style.display = 'block';
                                    addlinkbutton.setAttribute('class', 'waves-effect waves-light btn');
                                    addlinkbutton.textContent = 'Add Link';
                                    const resetform = category._id + 'form';
                                    $("#" + resetform)[0].reset();

                                } else {
                                    console.log('Fehler bei Linkerstellung');
                                }
                            };
                            request.send(body);
                        }
                    });

                // Setup Collapsible Body in loop

                for (let c = 0; c < category.links.length; c++) {

                    // Adding Links to content

                    const divbody = document.createElement('div');
                    const card = createCard(category._id, category.links[c], true);

                    divbody.setAttribute('class', 'collapsible-body noMargin noPadding');

                    listitem.appendChild(divbody);
                    divbody.appendChild(card);
                }
            })
        } else {
            errortab2.textContent = 'You are not logged in.'
        }
    }
    ;
    request.send();
}

// Search the Storage for URL or Description

searchsubmiturldesc.addEventListener('click', function () {

    if (searchformurldesc.checkValidity()) {
        while (searchurldesccontent.firstChild) {
            searchurldesccontent.removeChild(searchurldesccontent.firstChild);
        }

        const searchinput = document.getElementById('searchfieldurldesc').value;
        const searchselect = document.getElementById('searchselecturldesc').value;

        let request = new XMLHttpRequest();
        request.open('GET', url + '/user/categories');
        request.setRequestHeader('Authorization', constructedJWT);
        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                let data = JSON.parse(request.response);

                data.forEach(category => {
                    for (let d = 0; d < category.links.length; d++) {
                        if (category.links[d].link.includes(searchinput) && searchselect === '1') {
                            let card = createCard(category._id, category.links[d], true);
                            searchurldesccontent.appendChild(card);
                        } else if (category.links[d].linkdescription.includes(searchinput) && searchselect === '2') {
                            let card = createCard(category._id, category.links[d], true);
                            searchurldesccontent.appendChild(card);
                        }
                    }
                });
            } else {
                errortab3.textContent = "You are not logged in.";
            }
        };
        request.send();
    } else {
        console.log('Fehler bei Suche');
    }
});

// Search the content for Tags

searchsubmittags.addEventListener('click', function () {

    if (searchformtags.checkValidity()) {
        while (searchtagscontent.firstChild) {
            searchtagscontent.removeChild(searchtagscontent.firstChild);
        }

        let tagcompare = [];
        let taginput = (M.Chips.getInstance($('#searchchipstags')).chipsData);
        for (let e = 0; e < taginput.length; e++) {
            tagcompare.push(taginput[e].tag);
        }

        let request = new XMLHttpRequest();
        request.open('GET', url + '/user/categories');
        request.setRequestHeader('Authorization', constructedJWT);
        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                let data = JSON.parse(request.response);

                data.forEach(category => {

                    let filteredLinks = category.links.filter(link =>
                        tagcompare.every(searchTag => link.tags.includes(searchTag))
                    );
                    for (let f = 0; f < filteredLinks.length; f++) {
                        if (filteredLinks && filteredLinks.length) {
                            const card = createCard(category._id, filteredLinks[f], false);
                            searchtagscontent.appendChild(card);
                        }
                    }
                });
            } else {
                errortab4.textContent = "You are not logged in.";
            }
        };
        request.send();
    } else {
        console.log('Fehler bei Suche');
    }
});

// Creating the cards inside the storage and search instance

function createCard(categoryid, link, place) {

    const card = document.createElement('div');
    const cardcontent = document.createElement('div');
    const span = document.createElement('span');
    const pdescription = document.createElement('p');
    const pdate = document.createElement('p');
    const ptags = document.createElement('p');
    const cardbottom = document.createElement('div');
    const visitlinkbutton = document.createElement('a');
    const deletelinkbutton = document.createElement('a');

    card.setAttribute('class', 'card blue-grey lighten-4');
    cardcontent.setAttribute('class', 'card-content');
    span.setAttribute('class', 'card-title');
    cardbottom.setAttribute('class', 'card-action');
    visitlinkbutton.setAttribute('href', '#');
    visitlinkbutton.setAttribute('class', 'green-text');
    deletelinkbutton.setAttribute('class', 'red-text');
    deletelinkbutton.setAttribute('href', '#');
    pdescription.setAttribute('class', 'underlinetext');
    pdate.setAttribute('class', 'right-align');

    const substringhelper = link.link;
    const substring = substringhelper.substring(0, 35);

    span.innerText = substring;
    pdescription.textContent = 'Description: ' + link.linkdescription;
    pdate.textContent = 'Link created at: ' + link.createdAt;
    ptags.textContent = 'Tags: ';
    visitlinkbutton.textContent = "Visit Link";
    deletelinkbutton.textContent = 'Delete Link';

    for (let i = 0; i < link.tags.length; i++) {
        const chipsinstance = M.Chips.getInstance(searchchipstags);
        const tagadd = document.createElement('a');
        tagadd.setAttribute('href', '#');
        tagadd.textContent = link.tags[i] + '  ';
        ptags.appendChild(tagadd);
        tagadd.addEventListener('click', function () {
            const chipsinstancedata = chipsinstance.chipsData;
            if (place) {
                $('ul.tabs').tabs("select", "tab3");
                $('ul.tabs').tabs("select", "tagstab");
                chipsinstance.deleteChip();
                console.log(searchtagscontent.hasChildNodes());
                if (searchtagscontent.hasChildNodes()) {
                    while (searchtagscontent.firstChild) {
                        searchtagscontent.removeChild(searchtagscontent.firstChild);
                    }
                }
            }
            chipsinstance.addChip({
                tag: link.tags[i],
            });
        })
    }

    card.appendChild(cardcontent);
    cardcontent.appendChild(pdate);
    cardcontent.appendChild(span);
    cardcontent.appendChild(pdescription);
    cardcontent.appendChild(ptags);
    card.appendChild(cardbottom);
    cardbottom.appendChild(visitlinkbutton);
    cardbottom.appendChild(deletelinkbutton);

    visitlinkbutton.addEventListener('click', function () {
        chrome.tabs.create({'url': link.link});
    });

    deletelinkbutton.addEventListener('click', function () {
        let request = new XMLHttpRequest();
        request.open('DELETE', url + '/user/categories/' + categoryid + '/links/' + link._id);
        request.setRequestHeader('Authorization', constructedJWT);
        request.setRequestHeader("Content-Type", "application/json");

        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                deletelinkbutton.parentNode.parentNode.parentNode.parentNode.removeChild(deletelinkbutton.parentNode.parentNode.parentNode);
            } else {
                console.log('Something went wrong');
            }
        };
        request.send();
    });

    return card;
}

// simple date format

function formatDate() {
    let d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}