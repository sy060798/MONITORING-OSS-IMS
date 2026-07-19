// ========================================
// MASTER MONITORING V7
// PART 1
// LOAD ENGINE + DATA SYNC
// OSS VS IMS
// SAFE VERSION
// ========================================


window.MASTER_STATE = {

    data:[],
    filter:[],
    page:1,
    limit:100,
    timer:null

};




// ========================================
// LOAD MASTER DATA
// ========================================

async function loadMaster(){


    try{


        showLoadingMaster(true);



        let oss =
        await getOSS();



        let ims =
        await getIMS();




        if(!Array.isArray(oss))
        oss=[];


        if(!Array.isArray(ims))
        ims=[];




        let imsMap={};




        ims.forEach(item=>{


            let key =
            String(
                item.reference_code || ""
            ).trim();



            if(key){

                imsMap[key]=item;

            }


        });







        let result=[];





        oss.forEach(item=>{


            let ref =
            String(
                item.reference_code || ""
            ).trim();



            let imsData =
            imsMap[ref];





            let row={


                wo:"-",


                reference_code:ref,


                customer:
                item.customer || "",



                city:
                item.city || "",



                bulan:"-",


                job_name:"-",


                status:"",


                note:""



            };









            if(!imsData){



                row.status =
                "Belum";



                row.note =
                "Belum masuk IMS";



            }

            else{



                row.wo =
                imsData.wo || "-";



                row.bulan =
                imsData.bulan || "-";



                row.job_name =
                imsData.job_name || "-";





                let st =
                String(
                    imsData.status || ""
                );






                if(

                    st==="Approved" ||

                    st==="Booked" ||

                    st==="Closed" ||

                    st==="Ready to Invoice"

                ){


                    row.status =
                    "Sudah";


                }



                else if(
                    st==="Revisi"
                ){


                    row.status =
                    "Revisi";


                    row.note =
                    "Perlu revisi";


                }



                else{


                    row.status =
                    "Progress";


                }




            }







            result.push(row);




        });







        MASTER_STATE.data =
        result;



        MASTER_STATE.filter =
        [...result];



        MASTER_STATE.page=1;




        renderMasterTable();



        updateMasterCard();



        generateMasterFilter();



    }



    catch(error){


        console.error(
            "MASTER LOAD ERROR",
            error
        );


        showMasterError();


    }



    finally{


        showLoadingMaster(false);


    }



}






// ========================================
// RENDER TABLE
// ========================================


function renderMasterTable(){



    let data =
    getMasterPageData();




    let tbody =
    document.getElementById(
        "masterData"
    );



    if(!tbody)
    return;





    if(data.length===0){


        tbody.innerHTML = `

        <tr>
        <td colspan="8">
        Data tidak ditemukan
        </td>
        </tr>

        `;


        return;


    }







    let html="";




    data.forEach(item=>{



        html += `


        <tr>


        <td>${item.wo}</td>


        <td>${item.reference_code}</td>


        <td>${item.customer}</td>


        <td>${item.city}</td>


        <td>${item.bulan}</td>


        <td>${item.job_name}</td>


        <td>
        ${masterStatusBadge(item.status)}
        </td>


        <td>${item.note || "-"}</td>


        </tr>


        `;



    });





    tbody.innerHTML =
    html;



    updateMasterPageInfo();



}




// ========================================
// PAGING DATA
// ========================================

function getMasterPageData(){



    let start =

    (MASTER_STATE.page-1)

    *

    MASTER_STATE.limit;





    return MASTER_STATE.filter.slice(

        start,

        start + MASTER_STATE.limit

    );


}




console.log(
"MASTER V7 PART 1 READY"
);

// ========================================
// MASTER MONITORING V7
// PART 2
// SEARCH + FILTER + BADGE
// ========================================



// ========================================
// SEARCH MASTER
// ========================================

function searchMaster(){


    filterMaster();


}






// ========================================
// FILTER MASTER
// ========================================

function filterMaster(){



    let search =

    document

    .getElementById(
        "searchMaster"
    )

    ?.value

    .toLowerCase() || "";





    let city =

    document

    .getElementById(
        "cityMaster"
    )

    ?.value || "";





    let status =

    document

    .getElementById(
        "statusMaster"
    )

    ?.value || "";





    let bulan =

    document

    .getElementById(
        "monthMaster"
    )

    ?.value || "";





    let job =

    document

    .getElementById(
        "jobMaster"
    )

    ?.value

    .toLowerCase() || "";









    MASTER_STATE.filter =

    MASTER_STATE.data.filter(item=>{





        let cocokSearch =

        !search

        ||

        String(
            item.reference_code
        )

        .toLowerCase()

        .includes(search);








        let cocokCity =

        !city

        ||

        item.city===city;







        let cocokStatus =

        !status

        ||

        item.status===status;








        let cocokBulan =

        !bulan

        ||

        item.bulan===bulan;








        let cocokJob =

        !job

        ||

        String(
            item.job_name
        )

        .toLowerCase()

        .includes(job);









        return (

            cocokSearch

            &&

            cocokCity

            &&

            cocokStatus

            &&

            cocokBulan

            &&

            cocokJob

        );




    });







    MASTER_STATE.page=1;



    renderMasterTable();



}









// ========================================
// GENERATE FILTER CITY
// ========================================

function generateMasterFilter(){



    generateCityFilter();


    generateMonthFilter();



}








function generateCityFilter(){



    let el =

    document.getElementById(
        "cityMaster"
    );



    if(!el)
    return;







    let list =

    [

        ...new Set(

            MASTER_STATE.data.map(

                x=>x.city

            )

        )

    ];






    let html =

    `<option value="">
    Semua Kota
    </option>`;







    list.forEach(city=>{


        if(city){


            html += `

            <option value="${city}">
            ${city}
            </option>

            `;


        }


    });






    el.innerHTML = html;



}








// ========================================
// GENERATE BULAN
// ========================================

function generateMonthFilter(){



    let el =

    document.getElementById(
        "monthMaster"
    );



    if(!el)
    return;






    let list =

    [

        ...new Set(

            MASTER_STATE.data.map(

                x=>x.bulan

            )

        )

    ];







    let html =

    `<option value="">
    Semua Bulan
    </option>`;







    list.forEach(month=>{


        if(
            month &&
            month!="-"
        ){


            html += `


            <option value="${month}">
            ${month}
            </option>


            `;


        }


    });






    el.innerHTML = html;



}









// ========================================
// STATUS BADGE
// ========================================

function masterStatusBadge(status){



    let color="";




    switch(status){


        case "Sudah":

            color="status-sudah";

        break;




        case "Progress":

            color="status-progress";

        break;




        case "Revisi":

            color="status-revisi";

        break;




        case "Belum":

            color="status-belum";

        break;




        default:

            color="";

    }






    return `


    <span class="badge ${color}">

    ${status}

    </span>


    `;



}







// ========================================
// UPDATE CARD SUMMARY
// ========================================

function updateMasterCard(){



    let data =
    MASTER_STATE.data;





    let sudah=0;

    let progress=0;

    let revisi=0;

    let belum=0;






    data.forEach(item=>{


        if(item.status==="Sudah")
        sudah++;


        else if(item.status==="Progress")
        progress++;


        else if(item.status==="Revisi")
        revisi++;


        else if(item.status==="Belum")
        belum++;



    });







    let a =
    document.getElementById(
        "masterSudah"
    );


    let b =
    document.getElementById(
        "masterProgress"
    );


    let c =
    document.getElementById(
        "masterRevisi"
    );


    let d =
    document.getElementById(
        "masterBelum"
    );







    if(a)
    a.innerText=sudah;



    if(b)
    b.innerText=progress;



    if(c)
    c.innerText=revisi;



    if(d)
    d.innerText=belum;




}





console.log(
"MASTER V7 PART 2 READY"
);

 // ========================================
// MASTER MONITORING V7
// PART 3
// EXPORT EXCEL + TOOLBAR + PAGINATION
// ========================================



// ========================================
// EXPORT EXCEL MASTER
// ========================================

function exportMasterExcel(){



    if(typeof XLSX==="undefined"){


        alert(
            "Library Excel belum aktif"
        );


        return;


    }







    let rows =

    MASTER_STATE.filter.map(item=>({



        WO:

        item.wo || "",




        Reference_Code:

        item.reference_code || "",




        Customer:

        item.customer || "",




        City:

        item.city || "",




        Bulan:

        item.bulan || "",




        Job_Name:

        item.job_name || "",




        Status:

        item.status || "",




        Note:

        item.note || ""



    }));







    if(rows.length===0){


        alert(
            "Tidak ada data untuk export"
        );


        return;


    }







    let ws =

    XLSX.utils.json_to_sheet(

        rows

    );







    ws["!cols"]=[


        {
            wch:15
        },


        {
            wch:20
        },


        {
            wch:25
        },


        {
            wch:15
        },


        {
            wch:15
        },


        {
            wch:25
        },


        {
            wch:15
        },


        {
            wch:30
        }


    ];








    let wb =

    XLSX.utils.book_new();







    XLSX.utils.book_append_sheet(

        wb,

        ws,

        "MASTER"

    );








    XLSX.writeFile(

        wb,

        "MASTER_MONITORING.xlsx"

    );




}








// ========================================
// REFRESH BUTTON
// ========================================

async function refreshMaster(){


    MASTER_STATE.page=1;


    await loadMaster();


}








// ========================================
// PAGINATION
// ========================================


function nextMasterPage(){



    let max =

    Math.ceil(

        MASTER_STATE.filter.length /

        MASTER_STATE.limit

    );






    if(

        MASTER_STATE.page < max

    ){



        MASTER_STATE.page++;


        renderMasterTable();



    }



}









function prevMasterPage(){



    if(

        MASTER_STATE.page>1

    ){



        MASTER_STATE.page--;


        renderMasterTable();



    }



}









function updateMasterPageInfo(){



    let el =

    document.getElementById(

        "masterPageInfo"

    );





    if(!el)
    return;








    let total =

    Math.ceil(

        MASTER_STATE.filter.length /

        MASTER_STATE.limit

    );








    el.innerText =



    "Halaman "

    +

    MASTER_STATE.page

    +

    " / "

    +

    (total || 1);



}









// ========================================
// LOAD BUTTON TOOLBAR
// ========================================


function initMasterToolbar(){



    let btnExport =

    document.querySelector(

        ".btn-export-master"

    );






    if(btnExport){



        btnExport.onclick =

        exportMasterExcel;



    }



}









// ========================================
// LAST UPDATE
// ========================================

function updateMasterInfo(){



    let el =

    document.getElementById(

        "loadingMaster"

    );




    if(el){



        el.innerHTML =

        "🟢 Ready " +

        new Date()

        .toLocaleTimeString(

            "id-ID"

        );


    }



}








console.log(
"MASTER V7 PART 3 READY"
);

// ========================================
// MASTER MONITORING V7
// PART 4
// REALTIME + INIT + GLOBAL ACCESS
// ========================================




// ========================================
// REALTIME START
// ========================================

function startMasterRealtime(){



    stopMasterRealtime();




    MASTER_STATE.timer =



    setInterval(()=>{



        loadMaster();



    },60000);




}








// ========================================
// STOP REALTIME
// ========================================

function stopMasterRealtime(){



    if(

        MASTER_STATE.timer

    ){



        clearInterval(

            MASTER_STATE.timer

        );



        MASTER_STATE.timer=null;



    }



}









// ========================================
// ERROR DISPLAY
// ========================================

function showMasterError(){



    let table =

    document.getElementById(

        "masterData"

    );






    if(table){



        table.innerHTML = `



        <tr>

        <td colspan="8">

        Gagal mengambil data Master

        </td>

        </tr>



        `;



    }



}









// ========================================
// LOADING STATUS
// ========================================

function showLoadingMaster(status){



    let el =

    document.getElementById(

        "loadingMaster"

    );






    if(!el)

    return;






    if(status){


        el.innerHTML =

        "⏳ Loading...";


    }


    else{


        updateMasterInfo();


    }




}









// ========================================
// INIT MASTER SYSTEM
// ========================================

async function initMasterSystem(){



    try{



        console.log(

            "START MASTER SYSTEM V7"

        );





        await loadMaster();





        startMasterRealtime();





        initMasterToolbar();





        console.log(

            "MASTER SYSTEM READY"

        );





    }


    catch(error){



        console.error(

            "MASTER INIT ERROR",

            error

        );



        showMasterError();



    }




}









// ========================================
// GLOBAL ACCESS HTML
// ========================================


window.loadMaster =

loadMaster;




window.refreshMaster =

refreshMaster;




window.searchMaster =

searchMaster;




window.filterMaster =

filterMaster;




window.exportMasterExcel =

exportMasterExcel;




window.nextMasterPage =

nextMasterPage;




window.prevMasterPage =

prevMasterPage;




window.startMasterRealtime =

startMasterRealtime;




window.stopMasterRealtime =

stopMasterRealtime;









// ========================================
// DOM READY
// ========================================


document.addEventListener(


"DOMContentLoaded",


()=>{


    initMasterSystem();


});








// ========================================
// CLEANUP
// ========================================


window.addEventListener(


"beforeunload",


()=>{


    stopMasterRealtime();


});








console.log(
"MASTER V7 PART 4 READY"
);

