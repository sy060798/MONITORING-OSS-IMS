// ========================================
// MASTER MONITORING V10
// PART 1 / 5
// LOAD ENGINE
// OSS STATUS DONE FILTER
// IMS VS OSS MASTER
// SESUAI HTML MASTER
// ========================================


// ========================================
// MASTER STATE
// ========================================

window.MASTER_STATE = {


    data: [],


    filter: [],


    page: 1,


    limit: 100,


    timer: null


};








// ========================================
// STATUS IMS SELESAI
// ========================================

const MASTER_FINISH_STATUS = [


    "Submitted",


    "Ready to Invoice",


    "Closed",


    "Booked",


    "Approved"


];









// ========================================
// LOAD MASTER DATA
// ========================================

async function loadMaster(){



    try{



        showLoadingMaster(true);





        // ================================
        // LOAD DATA
        // ================================


        let oss = await getAllOSS();


        let ims = await getAllIMS();


        let done = await getDONEAPI();








        if(!Array.isArray(oss))
        oss=[];



        if(!Array.isArray(ims))
        ims=[];



        if(!Array.isArray(done))
        done=[];









        // ================================
        // MAP DONE
        // ================================

        let doneMap={};





        done.forEach(item=>{



            let ref = String(

                item.reference_code || ""

            ).trim();





            if(ref){



                doneMap[ref]=true;



            }




        });










        // ================================
        // MAP IMS
        // ================================

        let imsMap={};






        ims.forEach(item=>{



            let ref = String(

                item.reference_code || ""

            ).trim();





            if(ref){


                imsMap[ref]=item;


            }



        });









        let result=[];










        // ================================
        // LOOP OSS
        // ================================


        oss.forEach(item=>{





            let ref = String(

                item.reference_code || ""

            ).trim();






            if(!ref)

            return;








            // =================================
            // CEK STATUS OSS
            // JIKA SUDAH DONE HILANG DARI WEB
            // =================================


            let ossStatus = String(

                item.status || ""

            )

            .toUpperCase()

            .trim();






            if(

                ossStatus==="DONE"

            ){


                return;


            }









            // =================================
            // CEK DONE SHEET
            // =================================


            if(doneMap[ref]){


                return;


            }









            let imsData =

            imsMap[ref];









            let row={



                wo:"-",


                reference_code:ref,


                customer:item.customer || "",


                city:item.city || "",


                bulan:"-",


                job_name:"-",


                status:"Belum",


                note:"Belum masuk IMS"



            };












            // =================================
            // JIKA ADA IMS
            // =================================


            if(imsData){



                row.wo =

                imsData.wo || "-";



                row.bulan =

                imsData.bulan || "-";



                row.job_name =

                imsData.job_name || "-";






                let status = String(

                    imsData.status || ""

                ).trim();







                if(

                    MASTER_FINISH_STATUS.includes(status)

                ){



                    row.status="Sudah";


                    row.note="Menunggu sync DONE";



                }






                else if(

                    status==="Revisi"

                ){



                    row.status="Revisi";


                    row.note="Perlu revisi";



                }







                else{



                    row.status="Progress";


                    row.note="IMS proses";



                }







            }









            result.push(row);







        });









        MASTER_STATE.data = result;


        MASTER_STATE.filter = [...result];


        MASTER_STATE.page = 1;









        renderMasterTable();


        updateMasterCard();


        generateMasterFilter();







    }

    catch(error){



        console.error(

            "MASTER V10 LOAD ERROR",

            error

        );



        showMasterError();



    }



    finally{



        showLoadingMaster(false);



    }




}











// ========================================
// PAGING
// ========================================

function getMasterPageData(){



    let start =

    (MASTER_STATE.page - 1)

    *

    MASTER_STATE.limit;





    return MASTER_STATE.filter.slice(


        start,


        start + MASTER_STATE.limit


    );



}








console.log(

"MASTER V10 PART 1 READY"

);

// ========================================
// MASTER MONITORING V10
// PART 2 / 5
// RENDER TABLE + SEARCH + FILTER
// SESUAI HTML MASTER
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

        Tidak ada data aktif

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





        let c1 =


        !search ||



        String(

            item.reference_code

        )

        .toLowerCase()

        .includes(search);








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








    let html = `


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









console.log(

"MASTER V10 PART 2 READY"

);

// ========================================
// MASTER MONITORING V10
// PART 3 / 5
// STATUS BADGE + SUMMARY CARD
// EXPORT EXCEL
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



    }







    return `


    <span class="badge ${cls}">

    ${status || "-"}

    </span>


    `;



}











// ========================================
// UPDATE SUMMARY CARD
// ========================================

function updateMasterCard(){



    let sudah=0;


    let progress=0;


    let revisi=0;


    let belum=0;









    MASTER_STATE.data.forEach(item=>{





        if(item.status==="Sudah"){


            sudah++;


        }





        else if(item.status==="Progress"){


            progress++;


        }







        else if(item.status==="Revisi"){


            revisi++;


        }







        else if(item.status==="Belum"){


            belum++;


        }





    });









    let el1 =

    document.getElementById(

        "masterSudah"

    );



    let el2 =

    document.getElementById(

        "masterProgress"

    );



    let el3 =

    document.getElementById(

        "masterRevisi"

    );



    let el4 =

    document.getElementById(

        "masterBelum"

    );










    if(el1)

    el1.innerText=sudah;





    if(el2)

    el2.innerText=progress;





    if(el3)

    el3.innerText=revisi;





    if(el4)

    el4.innerText=belum;






}











// ========================================
// EXPORT EXCEL MASTER
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

            "Tidak ada data"

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


        "MASTER"


    );








    XLSX.writeFile(


        wb,


        "MASTER_MONITORING.xlsx"


    );






}











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









console.log(

"MASTER V10 PART 3 READY"

);

// ========================================
// MASTER MONITORING V10
// PART 4 / 5
// PAGINATION + REALTIME + SYSTEM CONTROL
// SESUAI HTML MASTER
// ========================================


// ========================================
// NEXT PAGE
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



    MASTER_STATE.page=1;



    await loadMaster();



}











// ========================================
// REALTIME MASTER
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



        el.innerHTML =


        "🟢 Ready " +


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


    Gagal mengambil data Master


    </td>

    </tr>


    `;





}











// ========================================
// INIT MASTER
// ========================================

async function initMasterSystem(){



    try{



        console.log(

            "START MASTER V10"

        );








        await loadMaster();








        startMasterRealtime();








        console.log(

            "MASTER V10 READY"

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

"MASTER V10 PART 4 READY"

);

// ========================================
// MASTER MONITORING V10
// PART 5 / 5
// FINAL CLEANUP + DATA VALIDATION
// OSS STATUS DONE PROTECTION
// ========================================


// ========================================
// VALIDASI DATA MASTER
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







        // reference wajib ada

        if(!ref)

        return false;








        // keamanan tambahan

        // jika status OSS DONE

        // jangan tampil

        let statusOSS = String(

            item.status_oss || ""

        )

        .toUpperCase()

        .trim();







        if(

            statusOSS==="DONE"

        ){


            return false;


        }







        return true;



    });




}









// ========================================
// OVERRIDE LOAD MASTER FILTER
// ========================================

const originalLoadMaster = loadMaster;






async function loadMasterSafe(){



    try{



        await originalLoadMaster();





        MASTER_STATE.data =


        validateMasterData(

            MASTER_STATE.data

        );





        MASTER_STATE.filter =


        [...MASTER_STATE.data];






        MASTER_STATE.page=1;





        renderMasterTable();



        updateMasterCard();





    }



    catch(e){



        console.error(

            "MASTER SAFE ERROR",

            e

        );



    }



}









// ========================================
// CHECK DATA DONE MANUAL
// ========================================

function checkMasterDone(reference){



    if(!DONE_CACHE)

    return false;







    return DONE_CACHE.some(item=>{



        return String(

            item.reference_code || ""

        )

        ===

        String(reference);



    });



}









// ========================================
// CLEAN CACHE
// ========================================

function clearMasterCache(){



    MASTER_STATE.data=[];


    MASTER_STATE.filter=[];


    MASTER_STATE.page=1;



}









// ========================================
// FORCE UPDATE
// ========================================

async function forceMasterUpdate(){



    try{



        clearMasterCache();





        if(

            typeof refreshCache === "function"

        ){



            await refreshCache();



        }







        await loadMasterSafe();






    }



    catch(e){



        console.error(

            "FORCE UPDATE ERROR",

            e

        );



    }



}









// ========================================
// GLOBAL ACCESS TAMBAHAN
// ========================================


window.loadMasterSafe =

loadMasterSafe;



window.forceMasterUpdate =

forceMasterUpdate;



window.clearMasterCache =

clearMasterCache;









console.log(

"MASTER V10 PART 5 READY"

);
