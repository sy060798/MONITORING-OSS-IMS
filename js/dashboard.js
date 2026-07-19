// ========================================
// DASHBOARD JS V6
// OSS IMS MONITORING SYSTEM
// TAHAP 1
// CORE ENGINE + API SYNC CACHE
// FIX DONE CACHE LOAD
// ========================================


// ========================================
// GLOBAL STATE
// ========================================


window.DASHBOARD_DATA = {};

window.OSS_CACHE = [];

window.IMS_CACHE = [];

window.DONE_CACHE = [];

window.MASTER_CACHE = [];

window.DASHBOARD_TIMER = null;

window.STATUS_CHART = null;

window.DASHBOARD_READY = false;

window.API_RESPONSE_TIME = 0;





// ========================================
// LOAD DASHBOARD DATA
// ========================================


async function loadDashboardData(){


    let start =
    performance.now();


    try{


        console.log(
            "LOAD DASHBOARD DATA"
        );



        // ==========================
        // LOAD OSS
        // ==========================


        let oss =
        await apiRequest(
            "getOSS",
            {
                page:1,
                limit:1000
            }
        );


        if(
            oss &&
            oss.success
        ){

            OSS_CACHE =
            oss.data || [];

        }





        // ==========================
        // LOAD IMS
        // ==========================


        let ims =
        await apiRequest(
            "getIMS",
            {
                page:1,
                limit:1000
            }
        );


        if(
            ims &&
            ims.success
        ){

            IMS_CACHE =
            ims.data || [];

        }





        // ==========================
        // LOAD DONE
        // ==========================


        let done =
        await apiRequest(
            "getDONE",
            {
                page:1,
                limit:1000
            }
        );


        if(
            done &&
            done.success
        ){

            DONE_CACHE =
            done.data || [];

        }





        // ==========================
        // LOAD MASTER
        // ==========================


        let master =
        await apiRequest(
            "getMaster",
            {}
        );


        if(
            master &&
            master.success
        ){

            MASTER_CACHE =
            master.data || [];

        }






        let end =
        performance.now();


        API_RESPONSE_TIME =
        Math.round(
            end-start
        );






        console.log(
            "DASHBOARD CACHE",
            {

                OSS:
                OSS_CACHE.length,

                IMS:
                IMS_CACHE.length,

                DONE:
                DONE_CACHE.length,

                MASTER:
                MASTER_CACHE.length

            }
        );



        return true;



    }
    catch(error){


        console.error(
            "LOAD DASHBOARD ERROR",
            error
        );


        return false;


    }


}








// ========================================
// CALCULATE DASHBOARD
// ========================================


function calculateDashboard(){



    let selesai =
    DONE_CACHE.length;



    let progress =
    IMS_CACHE.filter(item=>{


        return String(
            item.status || ""
        )
        .toLowerCase()
        ===
        "progress";


    }).length;




    let revisi =
    IMS_CACHE.filter(item=>{


        return String(
            item.status || ""
        )
        .toLowerCase()
        ===
        "revisi";


    }).length;







    let imsRef =
    IMS_CACHE.map(item=>{


        return String(
            item.reference_code || ""
        )
        .trim();


    });






    let belumIMS =

    OSS_CACHE.filter(item=>{


        let ref =
        String(
            item.reference_code || ""
        )
        .trim();



        return (

            ref &&
            !imsRef.includes(ref)

        );


    }).length;






    DASHBOARD_DATA = {


        totalOSS:
        OSS_CACHE.length,


        totalIMS:
        IMS_CACHE.length,


        totalDONE:
        DONE_CACHE.length,


        totalMaster:
        MASTER_CACHE.length,


        selesai:
        selesai,


        progress:
        progress,


        revisi:
        revisi,


        belumIMS:
        belumIMS


    };




    return DASHBOARD_DATA;


}








// ========================================
// LOAD DASHBOARD MAIN
// ========================================


async function loadDashboard(){


    try{


        dashboardLoading(true);



        let result =
        await loadDashboardData();



        if(!result){

            throw new Error(
                "Data dashboard gagal"
            );

        }





        calculateDashboard();



        renderDashboard();



        updateAPIStatus(true);



        updateSystemMonitor();



        DASHBOARD_READY=true;




        console.log(
            "DASHBOARD READY",
            DASHBOARD_DATA
        );



    }
    catch(error){


        console.error(
            "DASHBOARD ERROR",
            error
        );


        updateAPIStatus(false);


    }
    finally{


        dashboardLoading(false);


    }



}








// ========================================
// VALUE HELPER
// ========================================


function setDashboardValue(
    id,
    value
){


    let el =
    document.getElementById(id);



    if(el){


        el.innerText =
        value ?? 0;


    }


}








// ========================================
// EXPORT
// ========================================


window.DASHBOARD_ENGINE = {


    reload:
    loadDashboard,


    calculate:
    calculateDashboard


};





console.log(
"DASHBOARD JS V6 TAHAP 1 READY"
);


// ========================================
// DASHBOARD JS V6
// OSS IMS MONITORING SYSTEM
// TAHAP 2
// STATUS ENGINE + SUMMARY + FILTER
// FIX DONE CACHE
// ========================================



// ========================================
// BUILD STATUS SUMMARY
// ========================================


function buildStatusSummary(){


    let ims =

    Array.isArray(IMS_CACHE)

    ?

    IMS_CACHE

    :

    [];




    let done =

    Array.isArray(DONE_CACHE)

    ?

    DONE_CACHE

    :

    [];






    let summary = {


        totalIMS:
        ims.length,


        totalDONE:
        done.length,


        progress:0,


        revisi:0,


        approved:0,


        booked:0,


        invoice:0,


        closed:0,


        lainnya:0


    };







    ims.forEach(item=>{


        let status =

        String(
            item.status || ""
        )

        .trim()

        .toLowerCase();





        switch(status){



            case "progress":

                summary.progress++;

            break;




            case "revisi":

                summary.revisi++;

            break;




            case "approved":

                summary.approved++;

            break;




            case "booked":

                summary.booked++;

            break;




            case "ready to invoice":

            case "invoice":

                summary.invoice++;

            break;




            case "closed":

                summary.closed++;

            break;




            default:

                summary.lainnya++;

            break;



        }



    });






    DASHBOARD_DATA.STATUS = summary;



    return summary;



}









// ========================================
// UPDATE STATUS CARD
// ========================================


function updateStatusSummary(){



    let data =
    buildStatusSummary();





    setDashboardValue(

        "statusIMS",

        data.totalIMS

    );




    setDashboardValue(

        "statusDONE",

        data.totalDONE

    );




    setDashboardValue(

        "statusProgress",

        data.progress

    );




    setDashboardValue(

        "statusRevisi",

        data.revisi

    );




    setDashboardValue(

        "statusClosed",

        data.closed

    );



}









// ========================================
// DONE TABLE RENDER
// ========================================


function renderDONEList(){



    let tbody =

    document.getElementById(

        "doneTable"

    );



    if(!tbody){

        return;

    }





    tbody.innerHTML="";





    DONE_CACHE.forEach(item=>{



        tbody.innerHTML += `


        <tr>


            <td>

            ${item.wo || ""}

            </td>



            <td>

            ${item.reference_code || ""}

            </td>



            <td>

            ${item.job_name || ""}

            </td>



            <td>

            <span class="badge bg-success">

            DONE

            </span>

            </td>



        </tr>


        `;



    });



}









// ========================================
// STATUS MONITOR TABLE
// ========================================


function renderStatusMonitoring(){



    let tbody =

    document.getElementById(

        "statusMonitoring"

    );




    if(!tbody){

        return;

    }






    let data =

    buildStatusSummary();





    tbody.innerHTML = `



    <tr>

        <td>DONE</td>

        <td>${data.totalDONE}</td>

    </tr>



    <tr>

        <td>Progress</td>

        <td>${data.progress}</td>

    </tr>



    <tr>

        <td>Revisi</td>

        <td>${data.revisi}</td>

    </tr>



    <tr>

        <td>Approved</td>

        <td>${data.approved}</td>

    </tr>



    <tr>

        <td>Booked</td>

        <td>${data.booked}</td>

    </tr>



    <tr>

        <td>Invoice</td>

        <td>${data.invoice}</td>

    </tr>



    <tr>

        <td>Closed</td>

        <td>${data.closed}</td>

    </tr>



    `;



}









// ========================================
// FILTER STATUS IMS
// ========================================


function filterDashboardStatus(status){



    let ims =

    Array.isArray(IMS_CACHE)

    ?

    IMS_CACHE

    :

    [];





    if(!status){

        return ims;

    }






    return ims.filter(item=>{


        return String(

            item.status || ""

        )

        .toLowerCase()

        ===

        String(status)

        .toLowerCase();



    });



}









// ========================================
// GLOBAL SEARCH
// ========================================


function globalDashboardSearch(keyword){



    keyword = String(

        keyword || ""

    )

    .toLowerCase();





    let all = [


        ...OSS_CACHE,


        ...IMS_CACHE,


        ...DONE_CACHE


    ];





    return all.filter(item=>{



        return (



            String(
                item.reference_code || ""
            )

            .toLowerCase()

            .includes(keyword)





            ||





            String(
                item.customer || ""
            )

            .toLowerCase()

            .includes(keyword)





            ||





            String(
                item.wo || ""
            )

            .toLowerCase()

            .includes(keyword)



        );



    });



}









// ========================================
// SYNC AFTER CHANGE
// ========================================


async function syncAfterChange(){



    try{



        await loadDashboardData();





        calculateDashboard();





        updateStatusSummary();





        renderStatusMonitoring();





        renderDONEList();





        renderDashboard();





        if(
            typeof renderStatusChart === "function"
        ){

            renderStatusChart();

        }





        updateSystemMonitor();





        console.log(

            "DASHBOARD SYNC OK"

        );




    }

    catch(error){


        console.error(

            "SYNC ERROR",

            error

        );


    }



}





console.log(
"DASHBOARD JS V6 TAHAP 2 READY"
);

// ========================================
// DASHBOARD JS V6
// OSS IMS MONITORING SYSTEM
// TAHAP 3
// TOOLBAR CONTROL + EXPORT + REFRESH
// FULL CACHE SYNC OSS IMS DONE
// ========================================


// ========================================
// REFRESH DASHBOARD
// ========================================


async function dashboardRefresh(){


    let btn =
    document.querySelector(
        ".btn-refresh"
    );



    try{


        if(btn){

            btn.disabled = true;

            btn.innerHTML =
            "⏳ Loading...";

        }




        dashboardLoading(true);




        await syncAfterChange();





        showDashboardToast(
            "Data berhasil disinkron"
        );



    }
    catch(error){



        console.error(

            "REFRESH ERROR",

            error

        );



        showDashboardToast(

            "Refresh gagal"

        );



    }
    finally{



        if(btn){


            btn.disabled=false;


            btn.innerHTML =
            "🔄 Refresh";


        }



        dashboardLoading(false);



    }


}









// ========================================
// EXPORT EXCEL FULL DATA
// ========================================


function exportFullDashboardExcel(){



    if(
        typeof XLSX === "undefined"
    ){


        alert(
            "Excel Library belum aktif"
        );


        return;


    }





    let wb =
    XLSX.utils.book_new();






    // ==========================
    // OSS
    // ==========================


    let ossSheet =

    XLSX.utils.json_to_sheet(

        OSS_CACHE

    );



    XLSX.utils.book_append_sheet(

        wb,

        ossSheet,

        "DATA OSS"

    );









    // ==========================
    // IMS
    // ==========================


    let imsSheet =

    XLSX.utils.json_to_sheet(

        IMS_CACHE

    );



    XLSX.utils.book_append_sheet(

        wb,

        imsSheet,

        "DATA IMS"

    );









    // ==========================
    // DONE
    // ==========================


    let doneSheet =

    XLSX.utils.json_to_sheet(

        DONE_CACHE

    );



    XLSX.utils.book_append_sheet(

        wb,

        doneSheet,

        "DATA DONE"

    );









    // ==========================
    // SUMMARY
    // ==========================


    let summary = [{

        TOTAL_OSS:

        OSS_CACHE.length,


        TOTAL_IMS:

        IMS_CACHE.length,


        TOTAL_DONE:

        DONE_CACHE.length,


        PROGRESS:

        DASHBOARD_DATA.STATUS?.progress || 0,


        REVISI:

        DASHBOARD_DATA.STATUS?.revisi || 0,


        CLOSED:

        DASHBOARD_DATA.STATUS?.closed || 0


    }];




    let summarySheet =

    XLSX.utils.json_to_sheet(

        summary

    );



    XLSX.utils.book_append_sheet(

        wb,

        summarySheet,

        "SUMMARY"

    );








    XLSX.writeFile(

        wb,

        "OSS_IMS_MONITORING.xlsx"

    );



}









// ========================================
// PRINT REPORT
// ========================================


function printReport(){


    window.print();


}









// ========================================
// TOOLBAR BUTTON ACTIVE
// ========================================


function activateDashboardToolbar(){



    let refresh =

    document.querySelector(

        ".btn-refresh"

    );




    if(refresh){


        refresh.onclick=function(){


            dashboardRefresh();


        };


    }








    let excel =

    document.querySelector(

        ".btn-export"

    );




    if(excel){



        excel.onclick=function(){


            exportFullDashboardExcel();



        };


    }








    let print =

    document.querySelector(

        ".btn-print"

    );




    if(print){



        print.onclick=function(){


            printReport();



        };


    }



}









// ========================================
// AUTO UPDATE STATUS
// ========================================


function autoUpdateDashboardStatus(){



    updateStatusSummary();


    renderStatusMonitoring();


    renderDONEList();


    updateSystemMonitor();



}









// ========================================
// REALTIME SYNC
// ========================================


function startDashboardSync(){



    if(DASHBOARD_TIMER){


        clearInterval(

            DASHBOARD_TIMER

        );


    }





    DASHBOARD_TIMER =

    setInterval(()=>{



        syncAfterChange();



    },60000);



}








function stopDashboardSync(){



    if(DASHBOARD_TIMER){



        clearInterval(

            DASHBOARD_TIMER

        );



        DASHBOARD_TIMER=null;



    }


}









// ========================================
// CTRL + R REFRESH
// ========================================


document.addEventListener(

"keydown",

function(e){



    if(

        e.ctrlKey &&

        e.key==="r"

    ){



        e.preventDefault();



        dashboardRefresh();



    }



});









// ========================================
// DOM READY
// ========================================


document.addEventListener(

"DOMContentLoaded",

()=>{



    activateDashboardToolbar();



    updateStatusSummary();



    renderStatusMonitoring();



    renderDONEList();



    startDashboardSync();



});








console.log(

"DASHBOARD JS V6 TAHAP 3 READY"

);

