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
