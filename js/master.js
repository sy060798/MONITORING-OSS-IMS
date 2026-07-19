// ========================================
// MASTER MONITORING V12
// PART 1 / 5
// CORE ENGINE + OSS SYNC
// OSS BASED MASTER SYSTEM
// ========================================


// ========================================
// MASTER STATE
// ========================================

window.MASTER_STATE = {


    data: [],


    filter: [],


    page:1,


    limit:100,


    timer:null


};








// ========================================
// MASTER LOAD START
// ========================================

async function loadMaster(){



    try{


        console.log(

            "LOAD MASTER V12 START"

        );



        showLoadingMaster(true);







        // ==============================
        // LOAD OSS UTAMA
        // ==============================


        let ossResponse =

        await apiRequest(

            "getOSS",

            {

                page:1,

                limit:10000

            }

        );







        let oss = [];



        if(

            ossResponse &&

            ossResponse.success

        ){


            oss =

            ossResponse.data || [];


        }









        // ==============================
        // LOAD IMS PELENGKAP
        // ==============================


        let imsResponse =

        await apiRequest(

            "getIMS",

            {

                page:1,

                limit:10000

            }

        );






        let ims=[];



        if(

            imsResponse &&

            imsResponse.success

        ){


            ims =

            imsResponse.data || [];


        }









        console.log(

            "MASTER SOURCE",

            {

                OSS:

                oss.length,


                IMS:

                ims.length


            }

        );









        // ==============================
        // INDEX IMS
        // ==============================


        let imsMap={};




        ims.forEach(item=>{


            let ref = String(

                item.reference_code || ""

            )

            .trim();





            if(ref){


                imsMap[ref]=item;


            }


        });









        // ==============================
        // BUILD MASTER DARI OSS
        // ==============================


        let result=[];






        oss.forEach(item=>{



            let ref = String(

                item.reference_code || ""

            )

            .trim();







            if(!ref)

            return;








            let row={



                reference_code:ref,


                customer:

                item.customer || "",


                city:

                item.city || "",


                wo:"-",


                job_name:"-",


                bulan:"-",


                status:"Belum",


                note:"Belum masuk IMS"



            };









            // ==========================
            // JIKA ADA IMS
            // ==========================


            if(

                imsMap[ref]

            ){



                let ims =

                imsMap[ref];





                row.wo =

                ims.wo || "-";




                row.job_name =

                ims.job_name || "-";




                row.bulan =

                ims.bulan || "-";




                row.status =

                ims.status || "Progress";




                row.note =

                "IMS aktif";



            }









            result.push(row);





        });









        MASTER_STATE.data =

        result;





        MASTER_STATE.filter =

        [

            ...result

        ];





        MASTER_STATE.page=1;








        renderMasterTable();


        updateMasterCard();


        generateMasterFilter();


        updateMasterPageInfo();








        console.log(

            "MASTER V12 DATA READY",

            MASTER_STATE.data

        );





        return true;



    }


    catch(error){



        console.error(

            "LOAD MASTER V12 ERROR",

            error

        );



        showMasterError();



        return false;



    }


    finally{


        showLoadingMaster(false);


    }



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


        start +

        MASTER_STATE.limit


    );



}









// ========================================
// EXPORT
// ========================================

window.loadMaster =

loadMaster;



window.getMasterPageData =

getMasterPageData;







console.log(

"MASTER V12 PART 1 READY"

);

// ========================================
// MASTER MONITORING V12
// PART 2 / 5
// RENDER + SEARCH + FILTER
// OSS BASED MASTER SYSTEM
// ========================================


// ========================================
// RENDER MASTER TABLE
// ========================================

function renderMasterTable(){



    let tbody =

    document.getElementById(

        "masterData"

    );




    if(!tbody)

    return;






    let data =

    getMasterPageData();








    if(

        data.length===0

    ){



        tbody.innerHTML = `


        <tr>

        <td colspan="8">

        Tidak ada OSS aktif


        </td>

        </tr>


        `;



        updateMasterPageInfo();



        return;


    }







    let html="";







    data.forEach(item=>{



        html += `



        <tr>


        <td>

        ${item.wo || "-"}

        </td>



        <td>

        ${item.reference_code || "-"}

        </td>



        <td>

        ${item.customer || "-"}

        </td>



        <td>

        ${item.city || "-"}

        </td>



        <td>

        ${item.bulan || "-"}

        </td>



        <td>

        ${item.job_name || "-"}

        </td>



        <td>

        ${masterStatusBadge(item.status)}

        </td>



        <td>

        ${item.note || "-"}

        </td>



        </tr>



        `;



    });








    tbody.innerHTML = html;



    updateMasterPageInfo();





}











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

    document.getElementById(

        "searchMaster"

    )

    ?.value

    .toLowerCase() || "";







    let city =

    document.getElementById(

        "cityMaster"

    )

    ?.value || "";







    let status =

    document.getElementById(

        "statusMaster"

    )

    ?.value || "";







    let bulan =

    document.getElementById(

        "monthMaster"

    )

    ?.value || "";







    let job =

    document.getElementById(

        "jobMaster"

    )

    ?.value

    ?.toLowerCase() || "";









    MASTER_STATE.filter =



    MASTER_STATE.data.filter(item=>{





        let c1 =



        !search ||



        (

            String(

                item.reference_code

            )

            .toLowerCase()

            .includes(search)


            ||


            String(

                item.customer

            )

            .toLowerCase()

            .includes(search)


            ||


            String(

                item.wo

            )

            .toLowerCase()

            .includes(search)



        );







        let c2 =



        !city ||



        item.city===city;







        let c3 =



        !status ||



        item.status===status;







        let c4 =



        !bulan ||



        item.bulan===bulan;







        let c5 =



        !job ||



        String(

            item.job_name

        )

        .toLowerCase()

        .includes(job);








        return (

            c1 &&

            c2 &&

            c3 &&

            c4 &&

            c5

        );





    });








    MASTER_STATE.page=1;



    renderMasterTable();






}









// ========================================
// GENERATE FILTER
// ========================================

function generateMasterFilter(){



    generateCityFilter();


    generateMonthFilter();


    generateStatusFilter();



}









// ========================================
// CITY FILTER
// ========================================

function generateCityFilter(){



    let el =

    document.getElementById(

        "cityMaster"

    );



    if(!el)

    return;







    let cities =

    [

        ...new Set(

            MASTER_STATE.data.map(

                x=>x.city

            )

        )

    ];







    let html = `


    <option value="">

    Semua Kota

    </option>


    `;







    cities.forEach(city=>{


        if(city){


            html += `


            <option value="${city}">

            ${city}

            </option>


            `;


        }


    });







    el.innerHTML=html;



}









// ========================================
// MONTH FILTER
// ========================================

function generateMonthFilter(){



    let el =

    document.getElementById(

        "monthMaster"

    );




    if(!el)

    return;







    let months =

    [

        ...new Set(

            MASTER_STATE.data.map(

                x=>x.bulan

            )

        )

    ];







    let html=`


    <option value="">

    Semua Bulan

    </option>


    `;







    months.forEach(month=>{



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








    el.innerHTML=html;



}









// ========================================
// STATUS FILTER
// ========================================

function generateStatusFilter(){



    let el =

    document.getElementById(

        "statusMaster"

    );




    if(!el)

    return;








    let status =

    [

        ...new Set(

            MASTER_STATE.data.map(

                x=>x.status

            )

        )

    ];








    let html = `


    <option value="">

    Semua Status

    </option>


    `;







    status.forEach(s=>{



        if(s){



            html += `


            <option value="${s}">

            ${s}

            </option>


            `;



        }



    });







    el.innerHTML=html;



}











// ========================================
// GLOBAL
// ========================================

window.renderMasterTable =

renderMasterTable;



window.searchMaster =

searchMaster;



window.filterMaster =

filterMaster;



window.generateMasterFilter =

generateMasterFilter;








console.log(

"MASTER V12 PART 2 READY"

);

// ========================================
// MASTER MONITORING V12
// PART 3 / 5
// STATUS + SUMMARY + EXPORT
// OSS ACTIVE BASED SYSTEM
// ========================================


// ========================================
// STATUS BADGE
// ========================================

function masterStatusBadge(status){



    let cls="";




    switch(status){



        case "Sudah":

            cls="status-sudah";

        break;




        case "Progress":

            cls="status-progress";

        break;




        case "Revisi":

            cls="status-revisi";

        break;




        case "Belum":

            cls="status-belum";

        break;




        default:

            cls="status-belum";

        break;



    }







    return `


    <span class="badge ${cls}">

    ${status || "-"}

    </span>


    `;



}









// ========================================
// UPDATE SUMMARY CARD
// DATA OSS AKTIF
// ========================================

function updateMasterCard(){



    let total=0;

    let sudah=0;

    let progress=0;

    let revisi=0;

    let belum=0;







    MASTER_STATE.data.forEach(item=>{



        total++;





        switch(item.status){



            case "Sudah":

                sudah++;

            break;




            case "Progress":

                progress++;

            break;




            case "Revisi":

                revisi++;

            break;




            default:

                belum++;

            break;



        }



    });








    let map={



        masterTotal:

        total,



        masterSudah:

        sudah,



        masterProgress:

        progress,



        masterRevisi:

        revisi,



        masterBelum:

        belum



    };







    Object.keys(map)

    .forEach(id=>{



        let el =

        document.getElementById(id);




        if(el){



            el.innerText =

            map[id];



        }



    });








    return map;



}











// ========================================
// GET STATISTIC
// ========================================

function getMasterStatistic(){



    let result={



        total:0,

        sudah:0,

        progress:0,

        revisi:0,

        belum:0



    };







    MASTER_STATE.data.forEach(item=>{



        result.total++;




        if(item.status==="Sudah"){


            result.sudah++;


        }

        else if(item.status==="Progress"){


            result.progress++;


        }

        else if(item.status==="Revisi"){


            result.revisi++;


        }

        else{


            result.belum++;


        }



    });







    return result;



}











// ========================================
// EXPORT EXCEL MASTER
// OSS ACTIVE
// ========================================

function exportMasterExcel(){



    if(

        typeof XLSX==="undefined"

    ){



        alert(

            "Library Excel belum aktif"

        );


        return;


    }








    let rows =



    MASTER_STATE.filter.map(item=>({




        Reference_Code:

        item.reference_code || "",





        Customer:

        item.customer || "",





        City:

        item.city || "",





        WO:

        item.wo || "",





        Job_Name:

        item.job_name || "",





        Bulan:

        item.bulan || "",





        Status:

        item.status || "",





        Note:

        item.note || ""



    }));









    if(

        rows.length===0

    ){



        alert(

            "Tidak ada data OSS"

        );



        return;


    }









    let ws =

    XLSX.utils.json_to_sheet(

        rows

    );






    let wb =

    XLSX.utils.book_new();








    XLSX.utils.book_append_sheet(

        wb,

        ws,

        "MASTER OSS"

    );









    XLSX.writeFile(

        wb,

        "MASTER_OSS_ACTIVE.xlsx"

    );






}











// ========================================
// REFRESH SUMMARY
// ========================================

function refreshMasterSummary(){



    updateMasterCard();



    return getMasterStatistic();



}











// ========================================
// GLOBAL EXPORT
// ========================================

window.masterStatusBadge =

masterStatusBadge;



window.updateMasterCard =

updateMasterCard;



window.getMasterStatistic =

getMasterStatistic;



window.exportMasterExcel =

exportMasterExcel;



window.refreshMasterSummary =

refreshMasterSummary;









console.log(

"MASTER V12 PART 3 READY"

);

// ========================================
// MASTER MONITORING V12
// PART 4 / 5
// PAGINATION + REALTIME + INIT
// OSS ACTIVE BASED SYSTEM
// ========================================


// ========================================
// NEXT PAGE
// ========================================

function nextMasterPage(){



    let max = Math.ceil(

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









// ========================================
// PREVIOUS PAGE
// ========================================

function prevMasterPage(){



    if(

        MASTER_STATE.page > 1

    ){



        MASTER_STATE.page--;



        renderMasterTable();



    }



}









// ========================================
// REFRESH MASTER
// ========================================

async function refreshMaster(){



    try{



        console.log(

            "REFRESH MASTER V12"

        );




        await loadMaster();




        console.log(

            "MASTER REFRESH SUCCESS"

        );



    }



    catch(error){



        console.error(

            "MASTER REFRESH ERROR",

            error

        );



    }



}









// ========================================
// REALTIME SYNC
// ========================================

function startMasterRealtime(){



    stopMasterRealtime();





    MASTER_STATE.timer =


    setInterval(()=>{



        refreshMaster();




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
// LOADING DISPLAY
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

        "⏳ Sync OSS...";



    }

    else{



        el.innerHTML =


        "🟢 Ready "


        +


        new Date()

        .toLocaleTimeString(

            "id-ID"

        );



    }



}











// ========================================
// ERROR DISPLAY
// ========================================

function showMasterError(){



    let tbody =

    document.getElementById(

        "masterData"

    );




    if(!tbody)

    return;







    tbody.innerHTML = `


    <tr>

    <td colspan="8">

    Gagal load OSS


    </td>

    </tr>


    `;



}









// ========================================
// INIT MASTER V12
// ========================================

async function initMasterSystem(){



    try{



        console.log(

            "START MASTER V12"

        );






        await loadMaster();






        startMasterRealtime();






        console.log(

            "MASTER V12 READY"

        );



    }



    catch(error){



        console.error(

            "MASTER V12 INIT ERROR",

            error

        );



        showMasterError();



    }



}











// ========================================
// GLOBAL HTML ACCESS
// ========================================

window.refreshMaster =

refreshMaster;



window.nextMasterPage =

nextMasterPage;



window.prevMasterPage =

prevMasterPage;



window.startMasterRealtime =

startMasterRealtime;



window.stopMasterRealtime =

stopMasterRealtime;



window.initMasterSystem =

initMasterSystem;











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

"MASTER V12 PART 4 READY"

);

// ========================================
// MASTER MONITORING V12
// PART 5 / 5
// FINAL PATCH + VALIDATION
// OSS ACTIVE BASED SYSTEM
// ========================================



// ========================================
// UPDATE PAGE INFO
// ========================================

function updateMasterPageInfo(){


    let el =

    document.getElementById(

        "masterPageInfo"

    );



    if(!el)

    return;





    let total = Math.ceil(

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
// VALIDATE MASTER DATA
// ========================================

function validateMasterData(data){



    if(!Array.isArray(data))

    return [];







    return data.filter(item=>{



        if(!item)

        return false;





        let ref =

        String(

            item.reference_code || ""

        )

        .trim();





        if(!ref)

        return false;





        return true;



    });



}









// ========================================
// CLEAN MASTER CACHE
// ========================================

function clearMasterCache(){



    MASTER_STATE.data=[];


    MASTER_STATE.filter=[];


    MASTER_STATE.page=1;



}









// ========================================
// FORCE UPDATE MASTER
// ========================================

async function forceMasterUpdate(){



    try{



        clearMasterCache();



        await loadMaster();





        console.log(

            "FORCE MASTER UPDATE SUCCESS"

        );



    }



    catch(error){



        console.error(

            "FORCE MASTER UPDATE ERROR",

            error

        );



    }



}









// ========================================
// UPDATE SYNC TIME
// ========================================

function updateMasterSyncTime(){



    let el =

    document.getElementById(

        "loadingMaster"

    );




    if(!el)

    return;





    el.innerHTML =


    "🟢 Sync OSS : "

    +

    new Date()

    .toLocaleString(

        "id-ID"

    );



}









// ========================================
// WRAP LOAD MASTER VALIDATION
// ========================================

const masterOldLoad =

window.loadMaster;






window.loadMaster = async function(){



    let result =

    await masterOldLoad();




    MASTER_STATE.data =

    validateMasterData(

        MASTER_STATE.data

    );





    MASTER_STATE.filter =

    [

        ...MASTER_STATE.data

    ];





    updateMasterCard();


    renderMasterTable();


    updateMasterSyncTime();




    return result;



};









// ========================================
// GLOBAL ACCESS
// ========================================

window.updateMasterPageInfo =

updateMasterPageInfo;



window.validateMasterData =

validateMasterData;



window.clearMasterCache =

clearMasterCache;



window.forceMasterUpdate =

forceMasterUpdate;



window.updateMasterSyncTime =

updateMasterSyncTime;









console.log(

"MASTER V12 PART 5 FINAL READY"

);

