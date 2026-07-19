// ========================================
// DASHBOARD JS V6
// OSS IMS MONITORING SYSTEM
// PART 1
// CORE ENGINE + API SYNC CACHE
// API JS V4 COMPATIBLE
// ========================================


// ========================================
// GLOBAL STATE
// ========================================


window.DASHBOARD_DATA = {};

window.OSS_CACHE =
window.OSS_CACHE || [];

window.IMS_CACHE =
window.IMS_CACHE || [];

window.DONE_CACHE =
window.DONE_CACHE || [];

window.MASTER_CACHE =
window.MASTER_CACHE || [];

window.DASHBOARD_TIMER =
window.DASHBOARD_TIMER || null;

window.STATUS_CHART =
window.STATUS_CHART || null;

window.DASHBOARD_READY = false;

window.API_RESPONSE_TIME = 0;





// ========================================
// SAFE API LOAD
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

            "LOAD DASHBOARD DATA ERROR",

            error

        );



        return false;



    }



}







// ========================================
// CALCULATION ENGINE
// ========================================


function calculateDashboard(){



    let selesai =

    DONE_CACHE.length;






    let progress =

    IMS_CACHE.filter(item=>{


        let status =

        String(

            item.status || ""

        )

        .toLowerCase();



        return (

            status ===

            "progress"

        );



    }).length;








    let revisi =

    IMS_CACHE.filter(item=>{


        let status =

        String(

            item.status || ""

        )

        .toLowerCase();



        return (

            status ===

            "revisi"

        );



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

            "DASHBOARD DATA READY",

            DASHBOARD_DATA

        );



    }


    catch(error){



        console.error(

            "DASHBOARD LOAD ERROR",

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
// EXPORT GLOBAL
// ========================================


window.DASHBOARD_ENGINE = {


    reload:

    loadDashboard,


    calculate:

    calculateDashboard


};





console.log(

"DASHBOARD JS V6 PART 1 READY"

);

// ========================================
// DASHBOARD JS V6
// OSS IMS MONITORING SYSTEM
// PART 2
// STATUS ENGINE + SUMMARY + FILTER
// SYNC DIRECT API CACHE
// ========================================


// ========================================
// STATUS SUMMARY ENGINE
// ========================================


function buildStatusSummary(){


    let ims = Array.isArray(IMS_CACHE)
        ? IMS_CACHE
        : [];



    let summary = {

        total: ims.length,

        done:0,

        progress:0,

        revisi:0,

        approved:0,

        booked:0,

        invoice:0,

        closed:0,

        lainnya:0

    };




    ims.forEach(item=>{


        let status = String(

            item.status ||

            ""

        )

        .trim()

        .toLowerCase();




        switch(status){


            case "done":

            case "selesai":

                summary.done++;

            break;



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



    let data = buildStatusSummary();




    setDashboardValue(

        "statusTotal",

        data.total

    );



    setDashboardValue(

        "statusDone",

        data.done

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
// DETAIL STATUS TABLE
// ========================================


function renderStatusMonitoring(){



    let tbody = document.getElementById(

        "statusMonitoring"

    );



    if(!tbody){

        return;

    }



    let data = buildStatusSummary();



    tbody.innerHTML = `



    <tr>

        <td>Done</td>

        <td>${data.done}</td>

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

        <td>Ready Invoice</td>

        <td>${data.invoice}</td>

    </tr>



    <tr>

        <td>Closed</td>

        <td>${data.closed}</td>

    </tr>



    `;



}







// ========================================
// FILTER DASHBOARD STATUS
// ========================================


function filterDashboardStatus(status){



    let ims = Array.isArray(

        IMS_CACHE

    )

    ? IMS_CACHE

    : [];




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
// SEARCH GLOBAL DASHBOARD
// ========================================


function globalDashboardSearch(keyword){



    keyword = String(

        keyword || ""

    )

    .toLowerCase();




    let result=[];



    let all = [

        ...(Array.isArray(OSS_CACHE)

            ? OSS_CACHE

            : []),


        ...(Array.isArray(IMS_CACHE)

            ? IMS_CACHE

            : [])

    ];





    result = all.filter(item=>{



        return (

            String(item.reference_code || "")

            .toLowerCase()

            .includes(keyword)



            ||



            String(item.customer || "")

            .toLowerCase()

            .includes(keyword)



            ||



            String(item.jobName || "")

            .toLowerCase()

            .includes(keyword)



            ||



            String(item.wo || "")

            .toLowerCase()

            .includes(keyword)

        );



    });




    return result;



}







// ========================================
// SYNC DASHBOARD AFTER CRUD
// ========================================


async function syncAfterChange(){



    try{



        if(typeof refreshAllData==="function"){



            await refreshAllData();



        }




        calculateDashboard();



        updateStatusSummary();



        renderStatusMonitoring();



        renderDashboard();



        renderStatusChart();



        updateSystemMonitor();



        console.log(

            "DASHBOARD SYNC OK"

        );



    }

    catch(error){



        console.error(

            "DASHBOARD SYNC ERROR",

            error

        );



    }


}







console.log(

"DASHBOARD JS V6 PART 2 READY"

);

// ========================================
// DASHBOARD JS V6
// OSS IMS MONITORING SYSTEM
// PART 3
// TOOLBAR CONTROL + EXPORT + REFRESH
// FULL SYNC OSS IMS
// ========================================


// ========================================
// REFRESH BUTTON TOOLBAR
// ========================================


async function dashboardRefresh(){


    let btn = document.querySelector(

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

            "REFRESH DASHBOARD ERROR",

            error

        );


        showDashboardToast(

            "Refresh gagal"

        );


    }

    finally{


        if(btn){


            btn.disabled=false;


            btn.innerHTML=

            "🔄 Refresh";


        }



        dashboardLoading(false);



    }


}







// ========================================
// EXPORT FULL DATA EXCEL
// ========================================


function exportFullDashboardExcel(){



    if(typeof XLSX==="undefined"){


        alert(

            "Excel Library belum aktif"

        );


        return;


    }




    let oss = Array.isArray(

        OSS_CACHE

    )

    ? OSS_CACHE

    : [];




    let ims = Array.isArray(

        IMS_CACHE

    )

    ? IMS_CACHE

    : [];





    let wb = XLSX.utils.book_new();





    // OSS SHEET


    let ossSheet = XLSX.utils.json_to_sheet(

        oss

    );



    XLSX.utils.book_append_sheet(

        wb,

        ossSheet,

        "DATA OSS"

    );








    // IMS SHEET


    let imsSheet = XLSX.utils.json_to_sheet(

        ims

    );



    XLSX.utils.book_append_sheet(

        wb,

        imsSheet,

        "DATA IMS"

    );









    // SUMMARY SHEET


    let summarySheet = XLSX.utils.json_to_sheet([

        {

            TOTAL_OSS:

            oss.length,


            TOTAL_IMS:

            ims.length,


            DONE:

            DASHBOARD_DATA.STATUS?.done || 0,


            PROGRESS:

            DASHBOARD_DATA.STATUS?.progress || 0,


            REVISI:

            DASHBOARD_DATA.STATUS?.revisi || 0,


            CLOSED:

            DASHBOARD_DATA.STATUS?.closed || 0


        }

    ]);





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
// DASHBOARD TOOLBAR BUTTON STATE
// ========================================


function activateDashboardToolbar(){



    let refresh = document.querySelector(

        ".btn-refresh"

    );



    if(refresh){



        refresh.onclick = function(){


            dashboardRefresh();



        };


    }







    let excel = document.querySelector(

        ".btn-export"

    );



    if(excel){



        excel.onclick=function(){


            exportFullDashboardExcel();



        };


    }







    let print = document.querySelector(

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


    updateSystemMonitor();



}









// ========================================
// REALTIME LOOP
// ========================================


function startDashboardSync(){



    if(DASHBOARD_TIMER){


        clearInterval(

            DASHBOARD_TIMER

        );


    }




    DASHBOARD_TIMER = setInterval(()=>{



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
// BUTTON SHORTCUT
// CTRL + R SYNC
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
// DOM READY PART 3
// ========================================


document.addEventListener(

"DOMContentLoaded",

()=>{


    activateDashboardToolbar();


    updateStatusSummary();


    renderStatusMonitoring();


    startDashboardSync();



});









console.log(

"DASHBOARD JS V6 PART 3 READY"

);

// ========================================
// DASHBOARD JS V6
// OSS IMS MONITORING SYSTEM
// PART 4
// FINAL INIT + CACHE SYNC + CLEANUP
// ========================================


// ========================================
// FINAL DASHBOARD START
// ========================================


async function startDashboardV6(){


    try{


        console.log(

            "START DASHBOARD V6"

        );




        dashboardLoading(true);





        // LOAD OSS CACHE


        if(

            typeof getAllOSS === "function"

        ){


            await getAllOSS();


        }






        // LOAD IMS CACHE


        if(

            typeof getAllIMS === "function"

        ){


            await getAllIMS();


        }








        // HITUNG DATA


        calculateDashboard();



        updateStatusSummary();





        // RENDER SEMUA


        renderDashboard();



        renderStatusChart();



        renderStatusMonitoring();



        updateSystemMonitor();




        activateDashboardToolbar();





        startDashboardSync();





        DASHBOARD_READY=true;





        console.log(

            "DASHBOARD V6 READY"

        );



    }



    catch(error){



        console.error(

            "START DASHBOARD ERROR",

            error

        );



        updateAPIStatus(false);



    }



    finally{


        dashboardLoading(false);



    }



}









// ========================================
// FORCE LOAD ALL DATA
// ========================================


async function forceDashboardSync(){



    try{



        showDashboardToast(

            "Sync OSS IMS..."

        );






        if(

            typeof refreshAllData === "function"

        ){


            await refreshAllData();



        }

        else{


            if(

                typeof getAllOSS==="function"

            ){


                await getAllOSS();


            }




            if(

                typeof getAllIMS==="function"

            ){


                await getAllIMS();


            }



        }





        calculateDashboard();



        updateStatusSummary();



        renderDashboard();



        renderStatusChart();



        renderStatusMonitoring();



        updateSystemMonitor();





        showDashboardToast(

            "Sync selesai"

        );



    }



    catch(err){



        console.error(

            "FORCE SYNC ERROR",

            err

        );



        showDashboardToast(

            "Sync gagal"

        );



    }



}









// ========================================
// DASHBOARD HEALTH CHECK
// ========================================


function dashboardHealthCheck(){



    let result={



        ready:DASHBOARD_READY,



        api:

        API_RESPONSE_TIME,



        oss:

        Array.isArray(OSS_CACHE)

        ? OSS_CACHE.length

        : 0,



        ims:

        Array.isArray(IMS_CACHE)

        ? IMS_CACHE.length

        : 0,



        status:

        DASHBOARD_DATA.STATUS || {}



    };




    console.table(result);



    return result;



}









// ========================================
// SAFE AUTO UPDATE
// ========================================


function safeDashboardUpdate(){



    try{



        calculateDashboard();



        updateStatusSummary();



        renderDashboard();



        renderStatusChart();



        renderStatusMonitoring();



    }



    catch(error){



        console.error(

            "AUTO UPDATE ERROR",

            error

        );



    }



}









// ========================================
// VISIBILITY SYNC
// ========================================


document.addEventListener(

"visibilitychange",

()=>{



    if(

        document.visibilityState==="visible"

    ){



        safeDashboardUpdate();



    }



});









// ========================================
// WINDOW CLEANUP
// ========================================


window.addEventListener(

"beforeunload",

()=>{



    stopDashboardSync();





    if(STATUS_CHART){



        STATUS_CHART.destroy();



        STATUS_CHART=null;



    }



});









// ========================================
// START APP
// ========================================


document.addEventListener(

"DOMContentLoaded",

()=>{



    startDashboardV6();



});









console.log(

"DASHBOARD JS V6 PART 4 FINAL READY"

);
