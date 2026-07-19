// ========================================
// DASHBOARD JS V4
// OSS IMS MONITORING SYSTEM
// API.JS V3 FINAL COMPATIBLE
// PART 1
// CORE + DATA LOADER
// ========================================


// ========================================
// GLOBAL STATE
// ========================================

let DASHBOARD_DATA = {};

let DASHBOARD_TIMER = null;

let STATUS_CHART = null;

let DASHBOARD_READY = false;







// ========================================
// LOAD DASHBOARD
// ========================================


async function loadDashboard(){


    try{


        dashboardLoading(true);



        let apiResult = await getDashboardAPI();



        if(!apiResult){

            apiResult={};

        }




        DASHBOARD_DATA = apiResult;




        // fallback jika dashboard API kosong

        if(

            !DASHBOARD_DATA.totalOSS

            &&

            typeof getAllOSS==="function"

        ){



            let oss = await getAllOSS();



            DASHBOARD_DATA.totalOSS =

            oss.length;



        }







        if(

            !DASHBOARD_DATA.totalIMS

            &&

            typeof getAllIMS==="function"

        ){



            let ims = await getAllIMS();



            DASHBOARD_DATA.totalIMS =

            ims.length;




            DASHBOARD_DATA.progress =

            ims.filter(x=>

                x.status==="Progress"

            ).length;





            DASHBOARD_DATA.revisi =

            ims.filter(x=>

                x.status==="Revisi"

            ).length;





            DASHBOARD_DATA.selesai =

            ims.filter(x=>

                x.status==="Closed"

                ||

                x.status==="Done"

            ).length;



        }






        renderDashboard();



        renderStatusChart();



        updateAPIStatus(true);



        updateLastUpdate();



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

        "done",

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





    setDashboardValue(

        "belum",

        DASHBOARD_DATA.belumIMS || 0

    );



}









// ========================================
// SET TEXT
// ========================================


function setDashboardValue(id,value){



    let el = document.getElementById(id);



    if(el){



        el.innerText=value;



    }



}









console.log(

"DASHBOARD JS V4 PART 1 READY"

);

// ========================================
// DASHBOARD JS V4
// OSS IMS MONITORING SYSTEM
// API.JS V3 FINAL COMPATIBLE
// PART 2
// CHART + STATUS MONITOR
// ========================================


// ========================================
// RENDER STATUS CHART
// ========================================


function renderStatusChart(){



    let canvas = document.getElementById(

        "statusChart"

    );




    if(!canvas){

        return;

    }






    if(typeof Chart==="undefined"){



        console.warn(

        "Chart JS belum aktif"

        );


        return;


    }






    if(STATUS_CHART){



        STATUS_CHART.destroy();



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




                data:[



                    DASHBOARD_DATA.selesai || 0,



                    DASHBOARD_DATA.progress || 0,



                    DASHBOARD_DATA.revisi || 0,



                    DASHBOARD_DATA.belumIMS || 0



                ],





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
// STATUS SUMMARY
// ========================================


function getDashboardSummary(){



    return {



        totalOSS:

        DASHBOARD_DATA.totalOSS || 0,



        totalIMS:

        DASHBOARD_DATA.totalIMS || 0,



        totalMaster:

        DASHBOARD_DATA.totalMaster || 0,



        selesai:

        DASHBOARD_DATA.selesai || 0,



        progress:

        DASHBOARD_DATA.progress || 0,



        revisi:

        DASHBOARD_DATA.revisi || 0,



        belum:

        DASHBOARD_DATA.belumIMS || 0



    };



}









// ========================================
// UPDATE API STATUS
// ========================================


function updateAPIStatus(status){



    let el = document.getElementById(

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
// LAST UPDATE
// ========================================


function updateLastUpdate(){



    setDashboardValue(


        "lastUpdate",



        new Date()

        .toLocaleString(

            "id-ID"

        )



    );



}









// ========================================
// LOADING STATUS
// ========================================


function dashboardLoading(state){



    let el = document.getElementById(

        "dashboardStatus"

    );





    if(!el){

        return;

    }






    if(state){



        el.innerText=

        "⏳ Loading...";



    }

    else{



        el.innerText=

        "🟢 Realtime";



    }



}









// ========================================
// MANUAL REFRESH
// ========================================


async function refreshDashboard(){



    await loadDashboard();



}









console.log(

"DASHBOARD JS V4 PART 2 READY"

);

// ========================================
// DASHBOARD JS V4
// OSS IMS MONITORING SYSTEM
// API.JS V3 FINAL COMPATIBLE
// PART 3
// REALTIME + FILTER + EXPORT
// ========================================


// ========================================
// REALTIME SYSTEM
// ========================================


function startDashboardRealtime(delay=60000){



    stopDashboardRealtime();




    DASHBOARD_TIMER=setInterval(()=>{



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
// FORCE SYNC ALL DATA
// ========================================


async function syncDashboard(){



    try{



        if(typeof refreshAllData==="function"){



            await refreshAllData();



        }




        await loadDashboard();




        if(typeof loadMaster==="function"){



            await loadMaster();



        }




        showDashboardToast(

            "Dashboard berhasil diperbarui"

        );



    }



    catch(error){



        console.error(

            "SYNC DASHBOARD ERROR",

            error

        );



    }



}









// ========================================
// SEARCH DASHBOARD
// ========================================


function searchDashboard(keyword){



    keyword = String(keyword || "")

    .toLowerCase();





    let result=[];






    if(typeof MASTER_CACHE!=="undefined"){



        result = MASTER_CACHE.filter(item=>{


            return (



                String(item.reference_code || "")

                .toLowerCase()

                .includes(keyword)



                ||



                String(item.customer || "")

                .toLowerCase()

                .includes(keyword)



                ||



                String(item.city || "")

                .toLowerCase()

                .includes(keyword)



            );



        });



    }







    if(typeof renderMaster==="function"){



        renderMaster(result);



    }



}









// ========================================
// EXPORT DASHBOARD REPORT
// ========================================


function exportDashboardExcel(){



    if(typeof XLSX==="undefined"){



        alert(

        "Excel library belum aktif"

        );



        return;



    }






    let summary=[{


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







    let ws = XLSX.utils.json_to_sheet(

        summary

    );





    let wb = XLSX.utils.book_new();





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
// TOAST MESSAGE
// ========================================


function showDashboardToast(message){



    let el=document.getElementById(

        "toast"

    );





    if(!el){

        return;

    }






    el.innerText=message;



    el.style.display="block";






    setTimeout(()=>{



        el.style.display="none";



    },3000);



}









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

"DASHBOARD JS V4 PART 3 READY"

);
// ========================================
// DASHBOARD JS V4
// OSS IMS MONITORING SYSTEM
// API.JS V3 FINAL COMPATIBLE
// PART 4
// FINAL INIT + AUTO LOAD SYSTEM
// ========================================


// ========================================
// SAFE LOAD DASHBOARD
// ========================================


async function safeLoadDashboard(){



    try{



        await loadDashboard();



    }



    catch(error){



        console.error(

            "SAFE DASHBOARD ERROR",

            error

        );



        updateAPIStatus(false);



    }



}









// ========================================
// LOAD FULL SYSTEM
// ========================================


async function initDashboardSystem(){



    try{



        console.log(

        "START DASHBOARD SYSTEM"

        );






        // cek koneksi API



        if(typeof testConnection==="function"){



            await testConnection();



        }







        // load dashboard utama



        await loadDashboard();








        // refresh module cache



        if(typeof refreshAllData==="function"){



            await refreshAllData();



        }








        // load ulang dashboard



        await loadDashboard();








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
// GET QUICK STATISTIC
// ========================================


function dashboardStatistic(){



    let data = {



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



    return data;



}









// ========================================
// AUTO REFRESH BUTTON
// ========================================


function autoRefreshDashboard(){



    loadDashboard();



}









// ========================================
// PRINT DASHBOARD
// ========================================


function printDashboard(){



    window.print();



}









// ========================================
// KEYBOARD SHORTCUT
// ========================================


document.addEventListener(

"keydown",

(e)=>{



    if(

        e.ctrlKey

        &&

        e.key==="r"

    ){



        e.preventDefault();



        loadDashboard();



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
// WINDOW CLEANUP
// ========================================


window.addEventListener(

"beforeunload",

()=>{



    stopDashboardRealtime();



});









console.log(

"DASHBOARD JS V4 FINAL COMPLETE"

);
