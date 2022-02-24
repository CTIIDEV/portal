module.exports = ({ id, name, prod }) => {
  const today = new Date();

  let totalGWP = 0;
  let totalAccYearPrev = 0;
  let totalAccYearCurr = 0;

  function fullDateFilter(todayDate) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return (
      todayDate.getDate() +
      " " +
      monthNames[todayDate.getMonth()] +
      " " +
      todayDate.getFullYear()
    );
  }

  function monthFilter(month) {
    const monthsNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return monthsNames[month];
  }

  function total(data) {
    for (var i = 0; i < data.length; i++) {
      totalGWP = totalGWP + data[i].reportYearCurr;
    }
    return totalGWP;
  }

  function template(data) {
    totalAccYearPrev = totalAccYearPrev + data.reportYearPrev;
    totalAccYearCurr = totalAccYearCurr + data.reportYearCurr;
    return `
      <tr>
        <td><small>${data.reportProductClass}</small></td>
        <td style="text-align: right;"><small>Rp. ${parseFloat(
          data.reportYearPrev
        )
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</small></td>
        <td style="text-align: right;"><small>Rp. ${parseFloat(
          data.reportYearCurr
        )
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</small></td>
        <td style="text-align: right;"><small>${parseFloat(
          ((data.reportYearCurr - data.reportYearPrev) / data.reportYearPrev) *
            100
        ).toFixed(2)}%</small></td>
      </tr>
    `;
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <!-- Required meta tags -->
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
      />
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

      <title>PDF Template</title>

      <style>
        .invoice-box {
          max-width: 800px;
          padding: 30px 60px;
          line-height: 1.15;
        }

        .invoice-box table {
          width: 100%;
        }

        .invoice-box p {
          margin: 0;
        }

        .invoice-box small {
          font-size: 70%;
        }

        .invoice-box .heading .tableGWP thead {
          text-align: center;
        }

        .table-bordered th,
        .table-bordered td {
          border: 1px solid black !important;
        }

        @media print {
          body{
            -webkit-print-color-adjust: exact; /*chrome & webkit browsers*/
            color-adjust: exact; /*firefox & IE */
          } 
        }
      </style>
    </head>
    <body>
      <div class="invoice-box">
        <table cellpadding="0" cellspacing="0">
        <tr class="top" style="border-bottom: 3px solid #d7d7d7">
          <td colspan="2">
            <table style="margin-bottom: 10px">
              <tr>
                <td class="title">
                  <img
                    src="https://en.cntaiping.com/tplresource/cms/www/taiping/img/v20/common/tp_90_logo.png"
                    style="width: 100%; max-width: 250px"
                  />
                </td>
                <td>
                  <div style="width: fit-content; margin-left: 100px">
                    <h6 style="margin-bottom: 0">
                      <small>
                        <b>PT. CHINA TAIPING INDONESIA</b>
                      </small>
                    </h6>
                    <p style="margin-bottom: 0; font-size: 12px">
                      <small>
                        The Tower, 16th Floor Jl. Jend. Gatot Subroto Kav. 12,
                        Jakarta 12930, Indonesia
                        <br />
                        Telp: (62-21) 80600910 Fax: (62-21) 252 2424
                        <br />
                        Website: www.id.cntaiping.com <br />
                        PT. CHINA TAIPING INSURANCE INDONESIA terdaftar dan
                        diawasi oleh Otoritas Jasa Keuangan</small
                      >
                    </p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr class="heading">
          <td colspan="2">
            <table style="margin: 10px 0">
              <tr>
                <td>
                  <div>
                    <p>
                      <small>
                        Kepada Bapak/Ibu <br />
                        ${name} / ${id} <br />
                        Di Tempat <br /><br />
                        <b>
                          Hal : Laporan Produksi Jan-${monthFilter(
                            today.getMonth()
                          )} 2021
                        </b>
                      </small>
                    </p>
                  </div>
                </td>
                <td style="text-align: right; vertical-align: top">
                  <div>
                    <p>
                      <small> Jakarta, ${fullDateFilter(today)} </small>
                    </p>
                  </div>
                </td>
              </tr>           
              <tr>
                <td colspan="2">
                  <div class="opening" style="margin-top: 20px;">
                    <p><small>
                      Dengan hormat, <br /><br />
                      Melalui surat ini, perkenankan kami atas nama
                      <b> PT. China Taiping Insurance Indonesia </b>
                      mengucapkan terima kasih yang sebesar-besarnya atas kepercayaan dan
                      kontribusi Bapak/Ibu yang sangat berarti di sepanjang tahun ${
                        today.getFullYear() - 1
                      }. Pada tahun ${today.getFullYear()}, Bapak/Ibu telah berhasil membukukan total premium bruto (GWP) sebesar
                      <b
                      >Rp. 
                      ${total(prod)
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </b>
                      dengan perincian sebagai berikut:
                    </small>
                    </p>
                </td>
              </tr>
            </table>
            <div style="margin: 40px 0">
              <h6><small><b>A. Production</b></small></h6>
              <table class="table table-sm table-bordered tableGWP" style="margin: 10px 0">
                <thead>
                  <tr>
                    <th scope="col"><small><b>Produk/Line Bisnis</b></small></th>
                    <th scope="col"><small><b>GWP YTD ${monthFilter(
                      today.getMonth()
                    )} ${today.getFullYear() - 1}</b></small></th>
                    <th scope="col"><small><b>GWP YTD ${monthFilter(
                      today.getMonth()
                    )} ${today.getFullYear()}</b></small></th>
                    <th scope="col"><small><b>+/- %</b></small></th>
                  </tr>
                </thead>
                <tbody>
                  ${prod.map(template).join("")}
                  <tr>
                    <td style="text-align: center;"><small><b>Total</b></small></td>
                    <td style="text-align: right;"><small>Rp. ${parseFloat(
                      totalAccYearPrev
                    )
                      .toFixed(2)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</small></td>
                    <td style="text-align: right;"><small>Rp. ${parseFloat(
                      totalAccYearCurr
                    )
                      .toFixed(2)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</small></td>
                    <td style="text-align: right;"><small>${parseFloat(
                      ((totalAccYearCurr - totalAccYearPrev) /
                        totalAccYearPrev) *
                        100
                    ).toFixed(2)}%</small></td>
                  </tr>
                </tbody>
              </table>  
            </div>
            <table style="margin: 10px 0">
              <tr>
                <td>
                  <div style="margin-bottom: 20px;">
                    <p>
                      <small>
                        Demikian, Laporan Produksi ini kami sampaikan. Akhir kata,
                        mari kita maju bersama untuk meraih kesuksesan yang lebih
                        besar di tahun ${today.getFullYear()} dengan semangat yang
                        baru.
                      </small>
                    </p>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div style="margin-bottom: 40px;">
                    <p style="text-align: center">
                      <small>
                        <b>Manage Your Risks, Enjoy Taiping Service!!!</b>
                      </small>
                    </p>
                  </div>
                </td>
              </tr>  
              <tr>
                <td colspan="2">
                  <table>
                    <tr>
                      <td>
                        <div class="footer left">
                          <p>
                            <small>
                              Salam Sukses,<br />
                              PT. China Taiping Insurance Indonesia    
                            </small>
                          </p>
                        </div>
                      </td>
                      <td></td>
                    </tr>
                  </table>
                </td>
              </tr>  
            </table>
          </td>
        </tr>
      </table>
      </>
    </body>
    </html>
  `;
};
