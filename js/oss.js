// ========================================
// LOAD OSS DATA
// FILTER STATUS KOSONG SAJA
// STATUS DONE TIDAK TAMPIL
// ========================================

async function loadOSS(){


    try{


        showLoadingOSS(true);



        let response =
        await apiRequest(

            "getOSS",

            {

                page:
                OSS_STATE.page,


                limit:
                OSS_STATE.limit

            }

        );





        console.log(

            "OSS RESPONSE",

            response

        );





        if(
            !response ||
            response.success!==true
        ){

            throw new Error(

                response.message ||
                "OSS API ERROR"

            );

        }







        // ====================================
        // FILTER DATA
        // HANYA STATUS KOSONG YANG TAMPIL
        // DONE / ISI APAPUN TIDAK TAMPIL
        // ====================================

        OSS_STATE.data =

        (response.data || []).filter(item=>{


            return String(item.status || "")

            .trim()

            ===

            "";


        });







        OSS_STATE.total =

        OSS_STATE.data.length;







        renderOSS(

            OSS_STATE.data

        );





        updateTotalOSS();




    }

    catch(error){


        console.error(

            "LOAD OSS ERROR",

            error

        );


        renderOSS([]);


    }

    finally{


        showLoadingOSS(false);


    }


}

function normalizeOSSRow(row){


    return {


        reference_code:

        row.reference_code ||

        row.Reference_Code ||

        row["Reference Code"] ||

        row.REFERENCE_CODE ||

        "",





        cust_id:

        row.cust_id ||

        row.Cust_ID ||

        row["Cust ID"] ||

        row.CUST_ID ||

        "",





        customer:

        row.customer ||

        row.Customer ||

        row.CUSTOMER ||

        "",





        city:

        row.city ||

        row.City ||

        row.CITY ||

        "",






        status:

        row.status ||

        row.STATUS ||

        row.Status ||

        ""



    };


}

async function getAllOSSData(){


    let all=[];

    let page=1;



    while(true){



        let response =

        await apiRequest(

            "getOSS",

            {

                page:page,

                limit:100

            }

        );





        if(
            !response ||
            response.success!==true ||
            !Array.isArray(response.data) ||
            response.data.length===0
        ){

            break;

        }






        // ====================================
        // FILTER DASHBOARD
        // HANYA STATUS KOSONG
        // DONE TIDAK IKUT HITUNG
        // ====================================

        all.push(


            ...response.data.filter(item=>{


                return String(item.status || "")

                .trim()

                ===

                "";


            })


        );





        page++;



    }



    return all;



}

async function saveOSS(){


    let data={


        reference_code:

        getOSSInput(
            "referenceCode"
        ),



        cust_id:

        getOSSInput(
            "custID"
        ),



        customer:

        getOSSInput(
            "customer"
        ),



        city:

        getOSSInput(
            "city"
        ),



        // DATA BARU DEFAULT STATUS KOSONG
        status:""



    };






    if(
        !data.reference_code
    ){


        alert(

            "Reference Code wajib diisi"

        );


        return;


    }







    try{


        let result;







        if(
            OSS_STATE.editID
        ){



            result =

            await apiRequest(

                "updateOSS",

                {

                    id:
                    OSS_STATE.editID,


                    ...data


                }

            );



        }

        else{



            result =

            await apiRequest(

                "addOSS",

                data

            );



        }








        console.log(

            "SAVE OSS",

            result

        );






        if(
            result.success
        ){


            closeOSS();



            resetOSSForm();



            OSS_STATE.page=1;



            await loadOSS();



        }

        else{


            alert(

                result.message

            );


        }






    }


    catch(error){


        console.error(

            "SAVE OSS ERROR",

            error

        );



        alert(

            "Gagal simpan OSS"

        );



    }




}

function exportOSSExcel(){



    if(
        typeof XLSX==="undefined"
    ){

        alert(
            "Excel belum aktif"
        );

        return;

    }







    let source = [];



    if(
        typeof OSS_STATE!=="undefined" &&
        Array.isArray(OSS_STATE.data)
    ){

        source =
        OSS_STATE.data;

    }







    let data =

    source.map(item=>({



        Reference_Code:

        item.reference_code || "",



        Cust_ID:

        item.cust_id || "",



        Customer:

        item.customer || "",



        City:

        item.city || "",



        STATUS:

        item.status || ""



    }));








    let ws =

    XLSX.utils.json_to_sheet(

        data

    );



    let wb =

    XLSX.utils.book_new();





    XLSX.utils.book_append_sheet(

        wb,

        ws,

        "OSS"

    );





    XLSX.writeFile(

        wb,

        "DATA_OSS.xlsx"

    );



}
