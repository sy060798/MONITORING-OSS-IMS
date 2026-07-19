// ========================================
// DASHBOARD JS V5
// OSS IMS MONITORING SYSTEM
// SYNC DATA DIRECT CACHE
// PART 1
// CORE + CALCULATION ENGINE
// ========================================


// ========================================
// GLOBAL STATE
// ========================================

let DASHBOARD_DATA = {};

let DASHBOARD_TIMER = null;

let STATUS_CHART = null;

let DASHBOARD_READY = false;

let API_RESPONSE_TIME = 0;







// ========================================
// CALCULATE DASHBOARD FROM OSS + IMS
// ========================================


function calculateDashboard(){



    let oss =

    Array.isArray(OSS_CACHE)

    ?

    OSS_CACHE

    :

    [];





    let ims =

    Array.isArray(IMS_CACHE)

    ?

    IMS_CACHE

    :

    [];








    let selesai =

    ims.filter(item=>{


        let status =

        String(
            item.status || ""
        )
        .toLowerCase();



        return (

            status==="done"

            ||

            status==="closed"

            ||

            status==="selesai"

        );



    }).length;







    let progress =

    ims.filter(item=>{


        return String(

            item.status || ""

        )
        .toLowerCase()

        ===

        "progress";



    }).length;








    let revisi =

    ims.filter(item=>{


        return String(

            item.status || ""

        )
        .toLowerCase()

        ===

        "revisi";



    }).length;







    let imsReference =

    ims.map(item=>{


        return String(

            item.reference_code || ""

        )
        .trim();



    });








    let belumIMS =

    oss.filter(item=>{


        let ref =

        String(

            item.reference_code || ""

        )
        .trim();




        return !imsReference.includes(ref);



    }).length;










    DASHBOARD_DATA = {



        totalOSS:

        oss.length,



        totalIMS:

        ims.length,



        totalMaster:

        oss.length,



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
// LOAD DASHBOARD
// ========================================


async function loadDashboard(){



    try{


        dashboardLoading(true);



        let start =

        performance.now();







        if(

            typeof refreshAllData==="function"

        ){


            await refreshAllData();



        }







        calculateDashboard();







        let end =

        performance.now();





        API_RESPONSE_TIME =

        Math.round(

            end-start

        );








        renderDashboard();



        renderStatusChart();



        updateAPIStatus(true);



        updateSystemMonitor();



        DASHBOARD_READY=true;





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
// RENDER CARD
// ========================================


function renderDashboard(){



    setDashboardValue(

        "totalOSS",

        DASHBOARD_DATA.totalOSS

    );



    setDashboardValue(

        "totalIMS",

        DASHBOARD_DATA.totalIMS

    );



    setDashboardValue(

        "totalMaster",

        DASHBOARD_DATA.totalMaster

    );



    setDashboardValue(

        "totalBelum",

        DASHBOARD_DATA.belumIMS

    );



    setDashboardValue(

        "selesai",

        DASHBOARD_DATA.selesai

    );



    setDashboardValue(

        "progress",

        DASHBOARD_DATA.progress

    );



    setDashboardValue(

        "revisi",

        DASHBOARD_DATA.revisi

    );



}









// ========================================
// SET VALUE
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
// LOADING STATUS
// ========================================


function dashboardLoading(state){



    let el =

    document.getElementById(

        "dashboardStatus"

    );



    if(!el){

        return;

    }





    if(state){


        el.innerText =

        "⏳ Loading Data...";


    }

    else{


        el.innerText =

        "🟢 Realtime";


    }



}








console.log(

"DASHBOARD JS V5 PART 1 READY"

);

// ========================================
// DASHBOARD JS V5
// OSS IMS MONITORING SYSTEM
// SYNC DATA DIRECT CACHE
// PART 2
// CHART + SYSTEM MONITOR
// ========================================


// ========================================
// RENDER STATUS CHART
// ========================================


function renderStatusChart(){



    const canvas =

    document.getElementById(

        "statusChart"

    );



    if(!canvas){

        return;

    }







    if(

        typeof Chart==="undefined"

    ){



        console.warn(

            "Chart JS belum aktif"

        );


        return;


    }







    if(STATUS_CHART){



        STATUS_CHART.destroy();



        STATUS_CHART=null;



    }








    let data = [



        DASHBOARD_DATA.selesai || 0,



        DASHBOARD_DATA.progress || 0,



        DASHBOARD_DATA.revisi || 0,



        DASHBOARD_DATA.belumIMS || 0



    ];








    if(

        data.every(

            value=>value===0

        )

    ){


        data=[1,0,0,0];


    }









    STATUS_CHART = new Chart(



        canvas,



        {



        type:"doughnut",





        data:{



            labels:[



                "Selesai",



                "Progress",



                "Revisi",



                "Belum IMS"



            ],





            datasets:[{



                data:data,



                backgroundColor:[



                    "#16a34a",



                    "#2563eb",



                    "#eab308",



                    "#dc2626"



                ],



                borderWidth:0



            }]



        },







        options:{



            responsive:true,



            maintainAspectRatio:false,



            cutout:"65%",





            plugins:{



                legend:{



                    position:"bottom"



                }



            }



        }



    );



}









// ========================================
// UPDATE API STATUS
// ========================================


function updateAPIStatus(status){



    const el =

    document.getElementById(

        "apiStatus"

    );



    if(!el){

        return;

    }







    if(status){



        el.innerHTML =

        "🟢 API Online";



    }

    else{



        el.innerHTML =

        "🔴 API Offline";



    }



}









// ========================================
// SYSTEM MONITOR
// ========================================


function updateSystemMonitor(){



    let update =

    document.getElementById(

        "lastUpdate"

    );



    if(update){



        update.innerText =

        new Date()

        .toLocaleString(

            "id-ID"

        );


    }









    let speed =

    document.getElementById(

        "apiSpeed"

    );



    if(speed){



        speed.innerText =

        API_RESPONSE_TIME

        +

        " ms";



    }









    let cache =

    document.getElementById(

        "cacheStatus"

    );



    if(cache){



        let total = 0;





        if(

            Array.isArray(

                OSS_CACHE

            )

        ){


            total +=

            OSS_CACHE.length;


        }







        if(

            Array.isArray(

                IMS_CACHE

            )

        ){


            total +=

            IMS_CACHE.length;


        }







        cache.innerText =

        total

        +

        " Data Loaded";



    }









    let health =

    document.getElementById(

        "systemHealth"

    );



    if(health){



        if(

            API_RESPONSE_TIME < 500

        ){



            health.innerHTML =

            "🟢 Stable";



        }

        else if(

            API_RESPONSE_TIME < 1500

        ){



            health.innerHTML =

            "🟡 Normal";



        }

        else{



            health.innerHTML =

            "🔴 Slow";



        }



    }



}









// ========================================
// DASHBOARD SUMMARY
// ========================================


function getDashboardSummary(){



    return {



        OSS:

        DASHBOARD_DATA.totalOSS || 0,



        IMS:

        DASHBOARD_DATA.totalIMS || 0,



        MASTER:

        DASHBOARD_DATA.totalMaster || 0,



        DONE:

        DASHBOARD_DATA.selesai || 0,



        PROGRESS:

        DASHBOARD_DATA.progress || 0,



        REVISI:

        DASHBOARD_DATA.revisi || 0,



        BELUM:

        DASHBOARD_DATA.belumIMS || 0



    };



}









// ========================================
// LAST UPDATE
// ========================================


function updateLastUpdate(){



    const el =

    document.getElementById(

        "lastUpdate"

    );



    if(el){



        el.innerText =

        new Date()

        .toLocaleString(

            "id-ID"

        );



    }



}








console.log(

"DASHBOARD JS V5 PART 2 READY"

);

// ========================================
// DASHBOARD JS V5
// OSS IMS MONITORING SYSTEM
// SYNC DATA DIRECT CACHE
// PART 3
// REALTIME + REFRESH + EXPORT
// ========================================


// ========================================
// START REALTIME
// ========================================


function startDashboardRealtime(
    delay=60000
){



    stopDashboardRealtime();




    DASHBOARD_TIMER =

    setInterval(()=>{



        loadDashboard();



    },delay);



}









// ========================================
// STOP REALTIME
// ========================================


function stopDashboardRealtime(){



    if(DASHBOARD_TIMER){



        clearInterval(

            DASHBOARD_TIMER

        );



        DASHBOARD_TIMER=null;



    }



}









// ========================================
// SAFE REFRESH
// ========================================


async function safeRefresh(){



    const btn =

    document.querySelector(

        ".btn-refresh"

    );



    try{



        if(btn){



            btn.disabled=true;



        }






        showDashboardToast(

            "Mengambil data terbaru..."

        );







        await loadDashboard();







        showDashboardToast(

            "Data berhasil diperbarui"

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



        }



    }



}









// ========================================
// FORCE SYNC OSS IMS
// ========================================


async function syncDashboard(){



    try{



        showDashboardToast(

            "Sinkronisasi OSS IMS..."

        );






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







        calculateDashboard();







        renderDashboard();



        renderStatusChart();



        updateSystemMonitor();







        showDashboardToast(

            "Sinkronisasi selesai"

        );



    }



    catch(error){



        console.error(

            "SYNC ERROR",

            error

        );



        showDashboardToast(

            "Sinkronisasi gagal"

        );



    }



}









// ========================================
// SEARCH DASHBOARD MASTER
// ========================================


function searchDashboard(keyword){



    keyword = String(

        keyword || ""

    )

    .toLowerCase();






    let result=[];







    if(

        Array.isArray(

            MASTER_CACHE

        )

    ){



        result =

        MASTER_CACHE.filter(item=>{



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

                    item.city || ""

                )

                .toLowerCase()

                .includes(keyword)



            );



        });



    }








    if(

        typeof renderMaster==="function"

    ){



        renderMaster(

            result

        );



    }



}









// ========================================
// EXPORT DASHBOARD
// ========================================


function exportDashboardExcel(){



    if(

        typeof XLSX==="undefined"

    ){



        alert(

            "Library Excel belum aktif"

        );



        return;



    }








    let report=[{



        Total_OSS:

        DASHBOARD_DATA.totalOSS || 0,



        Total_IMS:

        DASHBOARD_DATA.totalIMS || 0,



        Total_Master:

        DASHBOARD_DATA.totalMaster || 0,



        Selesai:

        DASHBOARD_DATA.selesai || 0,



        Progress:

        DASHBOARD_DATA.progress || 0,



        Revisi:

        DASHBOARD_DATA.revisi || 0,



        Belum_IMS:

        DASHBOARD_DATA.belumIMS || 0



    }];









    let ws =

    XLSX.utils.json_to_sheet(

        report

    );





    let wb =

    XLSX.utils.book_new();






    XLSX.utils.book_append_sheet(

        wb,

        ws,

        "DASHBOARD"

    );






    XLSX.writeFile(

        wb,

        "OSS_IMS_DASHBOARD.xlsx"

    );



}









// ========================================
// TOAST
// ========================================


function showDashboardToast(
    message
){



    let el =

    document.getElementById(

        "toast"

    );



    if(!el){

        return;

    }






    el.innerText =

    message;





    el.style.display=

    "block";







    setTimeout(()=>{



        el.style.display=

        "none";



    },3000);



}









// ========================================
// PRINT
// ========================================


function printDashboard(){



    window.print();



}








console.log(

"DASHBOARD JS V5 PART 3 READY"

);

// ========================================
// DASHBOARD JS V5
// OSS IMS MONITORING SYSTEM
// SYNC DATA DIRECT CACHE
// PART 4
// INIT SYSTEM + EVENT + CLEANUP
// ========================================


// ========================================
// INIT DASHBOARD SYSTEM
// ========================================


async function initDashboardSystem(){



    try{



        console.log(

            "START DASHBOARD SYSTEM"

        );








        // LOAD DATA OSS + IMS



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







        // HITUNG DATA SENDIRI



        calculateDashboard();








        // TAMPILKAN DASHBOARD



        renderDashboard();



        renderStatusChart();



        updateAPIStatus(true);



        updateSystemMonitor();







        startDashboardRealtime(

            60000

        );







        DASHBOARD_READY=true;







        console.log(

            "DASHBOARD SYSTEM READY"

        );



    }



    catch(error){



        console.error(

            "DASHBOARD INIT ERROR",

            error

        );



        updateAPIStatus(false);



    }



}









// ========================================
// QUICK STATISTIC
// ========================================


function dashboardStatistic(){



    return {



        TOTAL_OSS:

        DASHBOARD_DATA.totalOSS || 0,



        TOTAL_IMS:

        DASHBOARD_DATA.totalIMS || 0,



        TOTAL_MASTER:

        DASHBOARD_DATA.totalMaster || 0,



        SELESAI:

        DASHBOARD_DATA.selesai || 0,



        PROGRESS:

        DASHBOARD_DATA.progress || 0,



        REVISI:

        DASHBOARD_DATA.revisi || 0,



        BELUM_IMS:

        DASHBOARD_DATA.belumIMS || 0



    };



}









// ========================================
// AUTO REFRESH
// ========================================


function autoRefreshDashboard(){



    loadDashboard();



}









// ========================================
// KEYBOARD SHORTCUT
// CTRL + SHIFT + R
// ========================================


document.addEventListener(

"keydown",

(e)=>{



    if(



        e.ctrlKey

        &&

        e.shiftKey

        &&

        e.key==="R"



    ){



        e.preventDefault();



        safeRefresh();



    }



});









// ========================================
// DOM READY
// ========================================


document.addEventListener(

"DOMContentLoaded",

()=>{



    initDashboardSystem();



});









// ========================================
// CLEANUP
// ========================================


window.addEventListener(

"beforeunload",

()=>{



    stopDashboardRealtime();







    if(STATUS_CHART){



        STATUS_CHART.destroy();



        STATUS_CHART=null;



    }



});









console.log(

"DASHBOARD JS V5 FINAL COMPLETE"

);
