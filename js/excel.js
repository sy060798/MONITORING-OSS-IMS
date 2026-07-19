// ========================================
// EXCEL SYSTEM V3
// OSS IMS MONITORING
// FOLLOW API.JS RULE
// ========================================


// ========================================
// READ EXCEL FILE
// ========================================

function readExcel(file){

    return new Promise((resolve,reject)=>{


        let reader = new FileReader();



        reader.onload = function(e){

            try{


                let workbook = XLSX.read(

                    e.target.result,

                    {
                        type:"binary"
                    }

                );



                let sheetName =

                workbook.SheetNames[0];



                let sheet =

                workbook.Sheets[sheetName];



                let data =

                XLSX.utils.sheet_to_json(

                    sheet,

                    {
                        defval:""
                    }

                );



                resolve(data);



            }

            catch(error){

                reject(error);

            }


        };



        reader.onerror = function(error){

            reject(error);

        };



        reader.readAsBinaryString(file);



    });


}





// ========================================
// CLEAN HEADER
// ========================================

function cleanExcelHeader(text){

    return String(text)

    .trim()

    .toLowerCase()

    .replace(/_/g," ")

    .replace(/\s+/g," ");


}





// ========================================
// VALIDATE HEADER
// ========================================

function validateExcelHeader(data,required){


    if(!data || data.length===0){

        return false;

    }



    let header =

    Object.keys(data[0])

    .map(item=>

        cleanExcelHeader(item)

    );



    return required.every(item=>

        header.includes(

            cleanExcelHeader(item)

        )

    );


}





// ========================================
// IMPORT OSS EXCEL
// ========================================

async function uploadOSSExcel(){


    let file =

    document

    .getElementById(

        "excelOSS"

    )

    .files[0];



    if(!file){

        alert(
            "Pilih file OSS"
        );

        return;

    }



    try{


        let excel =

        await readExcel(file);




        if(!validateExcelHeader(

            excel,

            [

                "Reference Code",

                "Cust ID",

                "Customer",

                "City"

            ]

        )){


            alert(

                "Format Excel OSS salah"

            );


            return;

        }




        let data=[];



        excel.forEach(row=>{


            data.push({


                reference_code:

                row["Reference Code"] || "",



                cust_id:

                row["Cust ID"] || "",



                customer:

                row["Customer"] || "",



                city:

                row["City"] || ""


            });


        });






        const result =

        await bulkAddOSSAPI(data);





        if(result.success){


            alert(

                "Upload OSS berhasil"

            );



            if(typeof refreshAfterOSS === "function"){


                refreshAfterOSS();


            }


            else if(typeof loadOSS === "function"){


                loadOSS();


            }



        }



    }



    catch(error){


        console.error(

            "UPLOAD OSS ERROR",

            error

        );


        alert(

            "Upload OSS gagal"

        );


    }



}






// ========================================
// IMPORT IMS EXCEL
// ========================================

async function uploadIMSExcel(){


    let file =

    document

    .getElementById(

        "excelIMS"

    )

    .files[0];



    if(!file){


        alert(

            "Pilih file IMS"

        );


        return;

    }





    try{


        let excel =

        await readExcel(file);




        if(!validateExcelHeader(

            excel,

            [

                "WO",

                "Reference Code",

                "Quotation",

                "Job Name",

                "Status",

                "Bulan"

            ]

        )){


            alert(

                "Format Excel IMS salah"

            );


            return;


        }






        let data=[];



        excel.forEach(row=>{


            data.push({


                wo:

                row["WO"] || "",



                reference_code:

                row["Reference Code"] || "",



                quotation:

                row["Quotation"] || "",



                job_name:

                row["Job Name"] || "",



                status:

                row["Status"] || "Progress",



                bulan:

                row["Bulan"] || ""


            });



        });






        const result =

        await bulkAddIMSAPI(data);





        if(result.success){


            alert(

                "Upload IMS berhasil"

            );



            if(typeof loadIMS === "function"){


                loadIMS();


            }


        }



    }



    catch(error){


        console.error(

            "UPLOAD IMS ERROR",

            error

        );


        alert(

            "Upload IMS gagal"

        );


    }



}

