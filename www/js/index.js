$(document).ready(function () {

    var db = null;
    function onDeviceReady() {
        //alert('device ready');
        db = window.sqlitePlugin.openDatabase({name: "hotels.db", location: 'default'});

        db.transaction(function (tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS `hotels2` ( `id` INTEGER PRIMARY KEY AUTOINCREMENT, `latitude` DOUBLE NOT NULL , `longitude` DOUBLE NOT NULL , `name` VARCHAR(256) NOT NULL , `description` TEXT NOT NULL , `adresse` VARCHAR(256) NOT NULL , `phone` VARCHAR(256) NOT NULL , `email` VARCHAR(256) NOT NULL , `photo` VARCHAR(256) NOT NULL , `type` VARCHAR(256) NOT NULL , `ht_id` INT NOT NULL);");
        }, function (error) {
            alert('Transaction ERROR: ' + error.message);
            console.log('Transaction ERROR: ' + error.message);
        }, function () {
           // alert("Table Created Successfully !");
        });


    }

    var idit;
    var longitude;
    var latitude;
    var name;
    var description;
    var adresse;
    var phone;
    var email;
    var photo;
    var type;
    var ht_id;
    var currentPage = 78;


    function count(json) {
        var j = 0;
        $.each(json, function (i, item) {
            j++;
        });
        return j;
    }
    var list;
    var slist;

    function load_prem() {
        currentPage = 55;
        $("#page-title").html("Hotels Premium");
        var url = "https://etudiants-stgi.pu-pm.univ-fcomte.fr/projets-stgi/applications/jfozeu999/test.php?type=prem";
        $.ajax({
            type: 'GET',
            url: url,
            async: true,
            data: {},
            dataType: 'text',
            beforeSend: function (xhr) {

            },
            success: function (data, textStatus, jqXHR) {
                //data = $.parseJSON(data);
                $('#prem-list').html("");
                var json = JSON.parse(data);
                var n = count(json);
                list = json;
                $.each(list, function (i, item) {
                    //alert(item.name);
                    if (i == n - 1) {
                        var list = `
                        <li class="ui-last-child">
                            <a href="#psingleHotel" id="${i}" class="ui-btn ui-btn-icon-right ui-icon-carat-r hotels">
                                <h1>${item.name}</h1>
                            </a>
                        </li>`;
                    } else if (i == 0) {
                        var list = `
                        <li class="ui-first-child">
                            <a href="#psingleHotel" id="${i}" class="ui-btn ui-btn-icon-right ui-icon-carat-r hotels">
                                <h1>${item.name}</h1>
                            </a>
                        </li>`;
                    } else {
                        var list = `
                        <li>
                            <a href="#psingleHotel" id="${i}" class="ui-btn ui-btn-icon-right ui-icon-carat-r hotels">
                                <h1>${item.name}</h1>
                            </a>
                        </li>`;
                    }

                    $('#prem-list').append(list);
                    $('.hotels').click(display_single);
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {

            }
        });
    }


    function load_std() {
        currentPage = 54;
        $("#page-title").html("Hotels standard");
        var url = "https://etudiants-stgi.pu-pm.univ-fcomte.fr/projets-stgi/applications/jfozeu999/test.php?type=std";
        $.ajax({
            type: 'GET',
            url: url,
            async: true,
            data: {},
            dataType: 'text',
            beforeSend: function (xhr) {

            },
            success: function (data, textStatus, jqXHR) {
                //data = $.parseJSON(data);
                $('#prem-list').html("");
                var json = JSON.parse(data);
                var n = count(json);
                list = json;
                $.each(list, function (i, item) {
                    //alert(item.name);
                    if (i == n - 1) {
                        var list = `
                        <li class="ui-last-child">
                            <a href="#psingleHotel" id="${i}" class="ui-btn ui-btn-icon-right ui-icon-carat-r hotels">
                                <h1>${item.name}</h1>
                            </a>
                        </li>`;
                    } else if (i == 0) {
                        var list = `
                        <li class="ui-first-child">
                            <a href="#psingleHotel" id="${i}" class="ui-btn ui-btn-icon-right ui-icon-carat-r hotels">
                                <h1>${item.name}</h1>
                            </a>
                        </li>`;
                    } else {
                        var list = `
                        <li>
                            <a href="#psingleHotel" id="${i}" class="ui-btn ui-btn-icon-right ui-icon-carat-r hotels">
                                <h1>${item.name}</h1>
                            </a>
                        </li>`;
                    }

                    $('#prem-list').append(list);
                    $('.hotels').click(display_single);
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {

            }
        });
    }

    function verification(id) {
        currentPage = 45;
        var lens = 45;
        db.transaction(function (tx) {
            var query = "SELECT * FROM hotels2 WHERE ht_id = ?";
            tx.executeSql(query, [id], function (tx, res) {
                //alert(res.rows.length);
                lens = res.rows.length;
                if (lens > 0) {
                    $('#add_fav').unbind('click');
                    $('#add_fav').html("Retirer des favoris");
                    $('#add_fav').attr("id", "rem-fav");
                    $('#rem-fav').click(rem_fav);
                }
            });
        }, function (error) {
            alert('Transaction ERROR: ' + error.message);
            console.log('Transaction ERROR: ' + error.message);
            lens = 46;
        }, function () {
        });
    }

    $('#rem-fav').click(function () {
        rem_fav();
    });

    function rem_fav() {
        db.transaction(function (tx) {
            var query;
            var used_id;
            if (currentPage == 15) {
                query = "DELETE FROM hotels2 WHERE ht_id = ?";
                used_id = ht_id;
            } else {
                query = "DELETE FROM hotels2 WHERE ht_id = ?";
                used_id = idit;
            }
            tx.executeSql(query, [used_id], function (tx, res) {

            });
        }, function (error) {
            alert('Transaction ERROR: ' + error.message);
            console.log('Transaction ERROR: ' + error.message);
        }, function () {
            alert('Cette hotel a bien ete retirer de vos favoris ');
            $('#rem-fav').unbind();
            $('#rem-fav').off();
            $('#rem-fav').html("Ajouter au favoris");
            $('#rem-fav').attr("id", "add_fav");
            $('#add_fav').click(addToFav);
        });
    }

    function showPosition(latitude, longitude, name) {
        var lat = latitude;
        var lon = longitude;
        var latlon = new google.maps.LatLng(lat, lon)
        var mapholder = document.getElementById('mapholder')
        mapholder.style.height = '500px';
        mapholder.style.width = '100%';

        var myOptions = {
            center: latlon, zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL}
        };
        var map = new google.maps.Map(document.getElementById("mapholder"), myOptions);
        var marker = new google.maps.Marker({position: latlon, map: map, title: name});
    }

    function display_single() {
        currentPage = 5565;
        if ($('#rem-fav').length) {
            $('#rem-fav').unbind();
            $('#rem-fav').off();
            $('#rem-fav').html("Ajouter au favoris");
            $('#rem-fav').attr("id", "add_fav");
            $('#add_fav').click(addToFav);
        }


        var n = this.id;
        idit = list[n].id;
        verification(list[n].id);
        latitude = list[n].latitude;
        longitude = list[n].longitude;
        name = list[n].name;
        description = list[n].description;
        adresse = list[n].adresse;
        phone = list[n].phone;
        email = list[n].email;
        photo = list[n].photo;
        type = list[n].type;
        $('#the_name').html(list[n].name);
        $('#the_name2').html(list[n].name);
        $('#the_description').html(list[n].description);
        $('#the_adresse').html(list[n].adresse);

        $('#the_phone').html(list[n].phone);
        $('#the_phone').attr("href", "tel:" + list[n].phone);

        $('#the_mail').html(list[n].email);
        $('#the_mail').attr("href", "mailto:" + list[n].email);

        $('#the_image').attr("src", "img/" + list[n].photo);
        showPosition(parseFloat(list[n].latitude), parseFloat(list[n].longitude), list[n].name);
    }



    $('#prem-btn').click(function () {
        load_prem();
    });

    $('#std-btn').click(function () {
        load_std();
    });
    $('.hotels').click(display_single);

    function addToFav() {
        db.transaction(function (tx) {
            var query;
            var used_id;
            if (currentPage == 15) {
                query = "INSERT INTO hotels2 (longitude,latitude,name, description,adresse, phone, email, photo, type,ht_id) VALUES (?,?,?,?,?,?,?,?,?,?)";
                used_id = ht_id;
            } else {
                query = "INSERT INTO hotels2 (longitude,latitude,name, description,adresse, phone, email, photo, type,ht_id) VALUES (?,?,?,?,?,?,?,?,?,?)";
                used_id = idit;
            }
            
            tx.executeSql(query, [longitude, latitude, name, description, adresse, phone, email, photo, type, used_id], function (tx, res) {
                alert("L'Hotel a bien ete enregistrer !");
            });
        }, function (error) {
            alert('Transaction ERROR: ');
            console.log('Transaction ERROR: ' + error.message);
        }, function () {
            $('#add_fav').unbind('click');
            $('#add_fav').html("Retirer des favoris");
            $('#add_fav').attr("id", "rem-fav");
            $('#rem-fav').click(rem_fav);
        });
    }

    $('#add_fav').click(addToFav);


    function load_fav() {
        $("#page-title").html("Hotels Favoris");
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM hotels2', [], function (tx, results) {
                var len = results.rows.length, i;
                slist = results;
                $('#prem-list').html("");

                for (var i = 0; i < len; i++) {
                    if (i == len - 1) {
                        var list = `
                        <li class="ui-last-child">
                            <a href="#psingleHotel" id="${i}" class="ui-btn ui-btn-icon-right ui-icon-carat-r favorite">
                                <h1>${results.rows.item(i).name}</h1>
                            </a>
                        </li>`;
                    } else if (i == 0) {
                        var list = `
                        <li class="ui-first-child">
                            <a href="#psingleHotel" id="${i}" class="ui-btn ui-btn-icon-right ui-icon-carat-r favorite">
                                <h1>${results.rows.item(i).name}</h1>
                            </a>
                        </li>`;
                    } else {
                        var list = `
                        <li>
                            <a href="#psingleHotel" id="${i}" class="ui-btn ui-btn-icon-right ui-icon-carat-r favorite">
                                <h1>${results.rows.item(i).name}</h1>
                            </a>
                        </li>`;
                    }
                    $('#prem-list').append(list);
                    $('.favorite').click(display_single25);
                }

            }, function (error) {
                alert("error " + error.message);
            });

        });
    }

    $(document).on("pagebeforeshow", "#pchinois", function () {
        if (currentPage == 15) {
            load_fav();
            currentPage = 118;
        }
    });

    function display_single25() {
        if ($('#rem-fav').length) {
            /* $('#rem-fav').unbind();
             $('#rem-fav').off();
             $('#rem-fav').html("Ajouter au favoris");
             $('#rem-fav').attr("id", "add_fav");
             $('#add_fav').click(addToFav);*/
        } else {
            $('#add_fav').unbind('click');
            $('#add_fav').html("Retirer des favoris");
            $('#add_fav').attr("id", "rem-fav");
            $('#rem-fav').click(rem_fav);
        }
        var n = this.id;
        idit = slist.rows.item(n).id;
        ht_id = slist.rows.item(n).ht_id;
        latitude = slist.rows.item(n).latitude;
        longitude = slist.rows.item(n).longitude;
        name = slist.rows.item(n).name;
        description = slist.rows.item(n).description;
        adresse = slist.rows.item(n).adresse;
        phone = slist.rows.item(n).phone;
        email = slist.rows.item(n).email;
        photo = slist.rows.item(n).photo;
        type = slist.rows.item(n).type;
        currentPage = 15;

        $('#the_name').html(name);
        $('#the_name2').html(name);
        $('#the_description').html(description);
        $('#the_adresse').html(adresse);

        $('#the_phone').html(phone);
        $('#the_phone').attr("href", "tel:" + phone);

        $('#the_mail').html(email);
        $('#the_mail').attr("href", "mailto:" + email);

        $('#the_image').attr("src", "img/" + photo);
        showPosition(parseFloat(latitude), parseFloat(longitude), name);
    }



    $('#fav-btn').click(function () {
        $('#prem-list').html("");
        load_fav();
    });

    document.addEventListener('deviceready', onDeviceReady, false);

});