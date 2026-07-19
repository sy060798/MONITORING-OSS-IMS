// ========================================
// MASTER MONITORING V11
// PART 1 / 5
// OSS ACTIVE BASED SYSTEM
// IMS LOOKUP ONLY
// FAST LOAD ENGINE
// ========================================


// ========================================
// MASTER STATE
// ========================================

window.MASTER_STATE = {

    data: [],

    filter: [],

    page: 1,

    limit: 100,

    timer:null

};




// ========================================
// STATUS SELESAI IMS
// ========================================

const MASTER_DONE_STATUS = [

    "submitted",

    "ready to invoice",

    "closed",

    "booked",

    "approved",

    "done",

    "sudah"

];




// ========================================
// NORMALIZE
// ========================================

function normalizeMasterStatus(status){

    return String(status || "")

    .trim()

    .toLowerCase();

}




// ========================================
// LOAD MASTER V11
// OSS SEBAGAI SUMBER UTAMA
// ========================================

async function loadMaster(){


    try{


        showLoadingMaster(true);



        console.log(
            "LOAD MASTER V11 START"
        );



        // ===============================
        // LOAD OSS SAJA DULU
        // ===============================


        let oss = await getAllOSS();



        if(!Array.isArray(oss)){

            oss=[];

        }




        // ===============================
        // LOAD IMS UNTUK LOOKUP
        // BUKAN DIGABUNG
        // ===============================


        let ims = await getAllIMS();



        if(!Array.isArray(ims)){

            ims=[];

        }




        // ===============================
        // INDEX IMS
        // ===============================


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





        let result=[];




        // ===============================
        // LOOP OSS ACTIVE
        // ===============================


        oss.forEach(item=>{


            let ref = String(

                item.reference_code || ""

            )

            .trim();



            if(!ref)

            return;



            let ossStatus =

            normalizeMasterStatus(

                item.status

            );




            // skip jika OSS sudah selesai

            if(

                ossStatus==="done"

            ){

                return;

            }





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






            // ===============================
            // CEK IMS
            // ===============================


            let imsData =

            imsMap[ref];





            if(imsData){



                row.wo =

                imsData.wo || "-";



                row.job_name =

                imsData.job_name || "-";



                row.bulan =

                imsData.bulan || "-";



                let status =

                imsData.status || "";



                let cleanStatus =

                normalizeMasterStatus(

                    status

                );





                if(

                    MASTER_DONE_STATUS.includes(

                        cleanStatus

                    )

                ){



                    return;


                }





                row.status =

                status;



                row.note =

                "IMS aktif";



            }






            result.push(row);




        });







        MASTER_STATE.data = result;



        MASTER_STATE.filter =

        [...result];



        MASTER_STATE.page=1;






        renderMasterTable();


        updateMasterCard();


        generateMasterFilter();





        console.log(

            "MASTER V11 LOAD OK",

            result.length

        );





    }


    catch(error){



        console.error(

            "MASTER V11 ERROR",

            error

        );



        showMasterError();



    }


    finally{


        showLoadingMaster(false);


    }



}





// ========================================
// PAGE DATA
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
"MASTER V11 PART 1 READY"
);

// ========================================
// MASTER MONITORING V11
// PART 2 / 5
// RENDER TABLE + SEARCH + FILTER
// OSS ACTIVE SYSTEM
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






    if(data.length===0){



        tbody.innerHTML = `


        <tr>

            <td colspan="8">

                Tidak ada data aktif OSS

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

    .toLowerCase() || "";








    MASTER_STATE.filter =



    MASTER_STATE.data.filter(item=>{





        let text =



        (

            String(item.reference_code || "")

            +

            " "

            +

            String(item.customer || "")

            +

            " "

            +

            String(item.wo || "")

        )

        .toLowerCase();







        let c1 =


        !search ||


        text.includes(search);








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


        String(item.job_name || "")

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







    el.innerHTML = html;



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








    let html = `


    <option value="">

        Semua Bulan

    </option>


    `;







    months.forEach(month=>{



        if(

            month &&

            month !== "-"

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









console.log(

"MASTER V11 PART 2 READY"

);

// ========================================
// MASTER MONITORING V11
// PART 3 / 5
// SUMMARY CARD + STATUS BADGE + EXPORT
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
// HANYA DARI OSS AKTIF
// ========================================

function updateMasterCard(){



    let sudah=0;

    let progress=0;

    let revisi=0;

    let belum=0;







    MASTER_STATE.data.forEach(item=>{



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



            case "Belum":

                belum++;

            break;



        }



    });









    let elSudah =

    document.getElementById(

        "masterSudah"

    );



    let elProgress =

    document.getElementById(

        "masterProgress"

    );



    let elRevisi =

    document.getElementById(

        "masterRevisi"

    );



    let elBelum =

    document.getElementById(

        "masterBelum"

    );








    if(elSudah)

    elSudah.innerText=sudah;



    if(elProgress)

    elProgress.innerText=progress;



    if(elRevisi)

    elRevisi.innerText=revisi;



    if(elBelum)

    elBelum.innerText=belum;



}











// ========================================
// EXPORT MASTER EXCEL
// DATA OSS SAJA
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









    if(rows.length===0){



        alert(

            "Tidak ada data OSS aktif"

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
// MASTER STATISTIC
// UNTUK DASHBOARD
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




        if(item.status==="Sudah")

        result.sudah++;




        else if(item.status==="Progress")

        result.progress++;




        else if(item.status==="Revisi")

        result.revisi++;




        else

        result.belum++;



    });






    return result;


}








// ========================================
// EXPORT GLOBAL
// ========================================

window.updateMasterCard =

updateMasterCard;



window.masterStatusBadge =

masterStatusBadge;



window.exportMasterExcel =

exportMasterExcel;



window.getMasterStatistic =

getMasterStatistic;









console.log(

"MASTER V11 PART 3 READY"

);

// ========================================
// MASTER MONITORING V11
// PART 4 / 5
// PAGINATION + REALTIME + CONTROL
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


        MASTER_STATE.page=1;



        await loadMaster();



        console.log(

            "MASTER REFRESH OK"

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

        "⏳ Sync OSS...";


    }

    else{


        el.innerHTML =

        "🟢 OSS Ready "

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

    Gagal mengambil data OSS


    </td>

    </tr>


    `;



}












// ========================================
// INIT MASTER SYSTEM
// ========================================

async function initMasterSystem(){



    try{



        console.log(

            "START MASTER V11"

        );




        await loadMaster();





        startMasterRealtime();





        console.log(

            "MASTER V11 READY"

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
// GLOBAL HTML ACCESS
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

"MASTER V11 PART 4 READY"

);

// ========================================
// MASTER MONITORING V11
// PART 5 / 5
// FINAL VALIDATION + CLEANUP
// OSS ACTIVE PROTECTION
// ========================================


// ========================================
// VALIDASI DATA MASTER
// SUMBER UTAMA OSS
// ========================================

function validateMasterData(data){



    if(!Array.isArray(data))

    return [];





    return data.filter(item=>{



        if(!item)

        return false;





        let ref = String(

            item.reference_code || ""

        ).trim();





        if(!ref)

        return false;







        let status = String(

            item.status || ""

        )

        .toUpperCase()

        .trim();







        // keamanan

        // jika sudah selesai jangan tampil

        if(

            status==="DONE"

        ){

            return false;

        }







        return true;



    });



}











// ========================================
// SAFE LOAD MASTER
// ========================================

const masterLoadOriginal =

loadMaster;







async function loadMasterSafe(){



    try{



        await masterLoadOriginal();






        MASTER_STATE.data =

        validateMasterData(

            MASTER_STATE.data

        );






        MASTER_STATE.filter =

        [

            ...MASTER_STATE.data

        ];






        MASTER_STATE.page=1;






        renderMasterTable();



        updateMasterCard();






        updateMasterSyncTime();






    }



    catch(error){



        console.error(

            "MASTER SAFE ERROR",

            error

        );



    }



}











// ========================================
// CEK REFERENCE AKTIF
// ========================================

function checkMasterReference(reference){



    if(

        !reference

    )

    return false;







    return MASTER_STATE.data.some(item=>{



        return String(

            item.reference_code

        )

        ===

        String(reference);



    });



}











// ========================================
// CLEAR CACHE MASTER
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






        await loadMasterSafe();






        console.log(

            "FORCE MASTER UPDATE OK"

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
// SYNC TIME INFO
// ========================================

function updateMasterSyncTime(){



    let el =

    document.getElementById(

        "loadingMaster"

    );





    if(!el)

    return;






    el.innerHTML =


    "🟢 OSS Sync : "

    +

    new Date()

    .toLocaleString(

        "id-ID"

    );



}











// ========================================
// MASTER HEALTH CHECK
// ========================================

function masterHealthCheck(){



    let result={



        total:

        MASTER_STATE.data.length,



        page:

        MASTER_STATE.page,



        time:

        new Date()



    };




    console.table(result);



    return result;



}











// ========================================
// GLOBAL EXPORT
// ========================================

window.loadMasterSafe =

loadMasterSafe;




window.forceMasterUpdate =

forceMasterUpdate;




window.clearMasterCache =

clearMasterCache;




window.checkMasterReference =

checkMasterReference;




window.masterHealthCheck =

masterHealthCheck;












// ========================================
// AUTO START
// ========================================

document.addEventListener(

"visibilitychange",

()=>{


    if(

        document.visibilityState==="visible"

    ){


        loadMasterSafe();


    }



});











// ========================================
// FINAL READY
// ========================================

console.log(

"MASTER V11 PART 5 FINAL READY"

);
