// ========================================
// DASHBOARD JS V4 FINAL SYNC API V4
// OSS IMS MONITORING SYSTEM
// PART 1
// CORE + DASHBOARD LOADER
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
// LOAD DASHBOARD
// ========================================

async function loadDashboard(){


    try{


        dashboardLoading(true);



        let startTime =
        performance.now();




        let result =
        await getDashboardAPI();




        let endTime =
        performance.now();



        API_RESPONSE_TIME =
        Math.round(
            endTime - startTime
        );




        if(
            result &&
            result.success
        ){


            DASHBOARD_DATA =
            result.data || {};



        }

        else{


            DASHBOARD_DATA = {};



        }






        // FALLBACK HITUNG DARI CACHE

        if(
            !DASHBOARD_DATA.totalOSS &&
            typeof OSS_CACHE !== "undefined"
        ){


            DASHBOARD_DATA.totalOSS =
            OSS_CACHE.length;


        }





        if(
            !DASHBOARD_DATA.totalIMS &&
            typeof IMS_CACHE !== "undefined"
        ){


            DASHBOARD_DATA.totalIMS =
            IMS_CACHE.length;



            DASHBOARD_DATA.progress =

            IMS_CACHE.filter(item=>

                item.status==="Progress"

            ).length;



            DASHBOARD_DATA.revisi =

            IMS_CACHE.filter(item=>

                item.status==="Revisi"

            ).length;



            DASHBOARD_DATA.selesai =

            IMS_CACHE.filter(item=>

                item.status==="Done"
                ||
                item.status==="Closed"

            ).length;



        }






        renderDashboard();



        renderStatusChart();



        updateAPIStatus(true);



        updateSystemMonitor();



        DASHBOARD_READY=true;



    }


    catch(error){


        console.error(

            "LOAD DASHBOARD ERROR",

            error

        );


        updateAPIStatus(false);



    }


    finally{


        dashboardLoading(false);


    }



}








// ========================================
// RENDER DASHBOARD CARD
// ========================================


function renderDashboard(){



    setDashboardValue(

        "totalOSS",

        DASHBOARD_DATA.totalOSS || 0

    );




    setDashboardValue(

        "totalIMS",

        DASHBOARD_DATA.totalIMS || 0

    );




    setDashboardValue(

        "totalMaster",

        DASHBOARD_DATA.totalMaster || 0

    );




    setDashboardValue(

        "totalBelum",

        DASHBOARD_DATA.belumIMS || 0

    );




    setDashboardValue(

        "selesai",

        DASHBOARD_DATA.selesai || 0

    );




    setDashboardValue(

        "progress",

        DASHBOARD_DATA.progress || 0

    );




    setDashboardValue(

        "revisi",

        DASHBOARD_DATA.revisi || 0

    );



}








// ========================================
// SET VALUE HELPER
// ========================================


function setDashboardValue(
    id,
    value
){


    const el =
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



    const el =
    document.getElementById(
        "dashboardStatus"
    );



    if(!el){

        return;

    }




    if(state){


        el.innerText =
        "⏳ Loading...";


    }

    else{


        el.innerText =
        "🟢 Realtime";


    }


}








console.log(
"DASHBOARD JS V4 PART 1 READY"
);

// ========================================
// DASHBOARD JS V4 FINAL SYNC API V4
// OSS IMS MONITORING SYSTEM
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
        typeof Chart === "undefined"
    ){


        console.warn(
            "Chart.js belum aktif"
        );


        return;

    }





    if(STATUS_CHART){


        STATUS_CHART.destroy();


        STATUS_CHART=null;


    }






    let chartData=[


        DASHBOARD_DATA.selesai || 0,


        DASHBOARD_DATA.progress || 0,


        DASHBOARD_DATA.revisi || 0,


        DASHBOARD_DATA.belumIMS || 0


    ];






    // jika semua kosong

    if(
        chartData.every(
            x=>x===0
        )
    ){


        chartData=[1,0,0,0];


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


                data:chartData,



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



    });



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
        "🟢 Online";


    }

    else{


        el.innerHTML =
        "🔴 Offline";


    }



}









// ========================================
// UPDATE SYSTEM MONITOR
// ========================================


function updateSystemMonitor(){



    const last =
    document.getElementById(
        "lastUpdate"
    );



    if(last){


        last.innerText =

        new Date()

        .toLocaleString(
            "id-ID"
        );


    }







    const speed =
    document.getElementById(
        "apiSpeed"
    );



    if(speed){



        speed.innerText =

        API_RESPONSE_TIME

        +" ms";



    }







    const cache =
    document.getElementById(
        "cacheStatus"
    );



    if(cache){



        let total=0;




        if(
            typeof OSS_CACHE !== "undefined"
        ){


            total +=
            OSS_CACHE.length;


        }





        if(
            typeof IMS_CACHE !== "undefined"
        ){


            total +=
            IMS_CACHE.length;


        }






        cache.innerText =

        total +

        " Records";



    }







    updateSystemHealth();



}









// ========================================
// SYSTEM HEALTH
// ========================================


function updateSystemHealth(){



    const el =
    document.getElementById(
        "systemHealth"
    );



    if(!el){

        return;

    }







    if(API_RESPONSE_TIME < 300){



        el.innerHTML =

        "🟢 Stable";



        el.className =
        "health-ok";



    }


    else if(
        API_RESPONSE_TIME < 1000
    ){



        el.innerHTML =

        "🟡 Normal";



        el.className =
        "health-warning";



    }


    else{


        el.innerHTML =

        "🔴 Slow";



        el.className =
        "health-error";



    }



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
"DASHBOARD JS V4 PART 2 READY"
);

// ========================================
// DASHBOARD JS V4 FINAL SYNC API V4
// OSS IMS MONITORING SYSTEM
// PART 3
// REFRESH + REALTIME + EXPORT + TOAST
// ========================================


// ========================================
// START REALTIME
// ========================================


function startDashboardRealtime(
    delay=60000
){


    stopDashboardRealtime();



    DASHBOARD_TIMER = setInterval(()=>{


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
// SAFE REFRESH BUTTON
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
            "Memperbarui data..."
        );





        if(
            typeof refreshAllData==="function"
        ){


            await refreshAllData();



        }






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

            "Gagal refresh data"

        );



    }


    finally{



        if(btn){


            btn.disabled=false;


        }



    }



}









// ========================================
// SYNC FULL SYSTEM
// ========================================


async function syncDashboard(){



    try{


        showDashboardToast(
            "Sinkronisasi sistem..."
        );





        if(
            typeof refreshAllData==="function"
        ){



            await refreshAllData();



        }






        await loadDashboard();







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
// SEARCH DASHBOARD
// ========================================


function searchDashboard(keyword){



    keyword = String(
        keyword || ""
    )
    .toLowerCase();




    let result=[];






    if(
        typeof MASTER_CACHE !== "undefined"
    ){



        result = MASTER_CACHE.filter(item=>{



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


        renderMaster(result);


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






    let data=[{

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
        data
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

        "DASHBOARD_REPORT.xlsx"

    );



}









// ========================================
// TOAST
// ========================================


function showDashboardToast(
    message
){



    const el =
    document.getElementById(
        "toast"
    );



    if(!el){

        return;

    }





    el.innerText =
    message;



    el.style.display =
    "block";







    setTimeout(()=>{


        el.style.display =
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
"DASHBOARD JS V4 PART 3 READY"
);

// ========================================
// DASHBOARD JS V4 FINAL SYNC API V4
// OSS IMS MONITORING SYSTEM
// PART 4
// INIT SYSTEM + EVENT + CLEANUP
// ========================================


// ========================================
// SAFE LOAD
// ========================================


async function safeLoadDashboard(){


    try{


        await loadDashboard();



    }


    catch(error){



        console.error(

            "SAFE LOAD DASHBOARD ERROR",

            error

        );



        updateAPIStatus(false);



    }



}









// ========================================
// INIT DASHBOARD SYSTEM
// ========================================


async function initDashboardSystem(){



    try{


        console.log(
            "START DASHBOARD SYSTEM"
        );






        // TEST CONNECTION API


        if(
            typeof testConnection==="function"
        ){


            let test =

            await testConnection();




            if(
                test &&
                test.success
            ){



                updateAPIStatus(true);



            }


            else{


                updateAPIStatus(false);


            }



        }









        // LOAD CACHE DATA


        if(
            typeof refreshAllData==="function"
        ){


            await refreshAllData();



        }









        // LOAD DASHBOARD


        await loadDashboard();









        // START REALTIME


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

        DASHBOARD_DATA.revisi || 0



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

"DASHBOARD JS V4 FINAL COMPLETE"

);
