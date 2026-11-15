/**
 * Generates an official, print-ready StaySphere booking receipt and invoice.
 * Automatically opens the browser print / "Save as PDF" dialog with zero external dependency overhead.
 * @param {Object} booking - Booking data object
 * @param {Object} [fallbackListing] - Listing details
 * @param {Object} [currentUser] - User profile
 */
export function generateInvoice(booking, fallbackListing = {}, currentUser = {}) {
  const listing = booking.listing || fallbackListing || {};
  const user = booking.user || currentUser || {};

  const invoiceId = `INV-${(booking._id || "CONFIRM").slice(-8).toUpperCase()}`;
  const checkIn = booking.checkIn
    ? new Date(booking.checkIn).toLocaleDateString("en-IN", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";
  const checkOut = booking.checkOut
    ? new Date(booking.checkOut).toLocaleDateString("en-IN", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  const nights = booking.totalNights || 1;
  const pricePerNight = booking.pricePerNight || listing.price || 0;
  const subtotal = booking.subtotal || pricePerNight * nights;
  const cleaningFee = booking.cleaningFee !== undefined ? booking.cleaningFee : 500;
  const serviceFee = booking.serviceFee !== undefined ? booking.serviceFee : 1000;
  const taxes = booking.taxes !== undefined ? booking.taxes : Math.round(subtotal * 0.18);
  const total = booking.totalPrice || subtotal + cleaningFee + serviceFee + taxes;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>StaySphere Receipt - ${invoiceId}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      color: #1a1a1a;
      background: #f8fafc;
      padding: 32px 16px;
      line-height: 1.5;
    }
    .invoice-card {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 24px;
      padding: 48px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 24px;
      border-bottom: 2px solid #f1f5f9;
      margin-bottom: 32px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-badge {
      width: 44px;
      height: 44px;
      background: #ff385c;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      color: #ff385c;
      letter-spacing: -0.5px;
    }
    .brand-sub {
      font-size: 11px;
      color: #64748b;
      font-weight: 500;
    }
    .status-badge {
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-bottom: 36px;
    }
    .info-box h4 {
      font-size: 11px;
      font-weight: 800;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 12px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 13px;
      border-bottom: 1px dashed #f1f5f9;
    }
    .info-label { color: #64748b; }
    .info-val { font-weight: 600; color: #0f172a; text-align: right; }
    
    .table-container {
      margin-bottom: 32px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    th {
      background: #f8fafc;
      padding: 12px 16px;
      font-size: 11px;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #e2e8f0;
    }
    td {
      padding: 14px 16px;
      font-size: 13px;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
    }
    .num { text-align: right; font-weight: 600; }
    
    .total-banner {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 20px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }
    .total-title {
      font-size: 13px;
      font-weight: 700;
      color: #475569;
    }
    .total-sub {
      font-size: 11px;
      color: #94a3b8;
    }
    .total-price {
      font-size: 26px;
      font-weight: 800;
      color: #ff385c;
    }
    
    .rules {
      background: #fffbeb;
      border: 1px solid #fef3c7;
      border-radius: 14px;
      padding: 16px 20px;
      font-size: 12px;
      color: #92400e;
      margin-bottom: 32px;
    }
    .rules strong { color: #78350f; }
    
    .footer {
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
      border-top: 1px solid #f1f5f9;
      padding-top: 24px;
    }

    .no-print-bar {
      max-width: 800px;
      margin: 0 auto 20px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .btn-print {
      background: #0f172a;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn-print:hover { background: #1e293b; }

    @media print {
      body { background: white; padding: 0; }
      .no-print-bar { display: none; }
      .invoice-card { border: none; box-shadow: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <span style="font-size: 13px; color: #64748b; font-weight: 600;">StaySphere Customer Receipt</span>
    <button class="btn-print" onclick="window.print()">
      <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
      Print / Save as PDF
    </button>
  </div>

  <div class="invoice-card">
    <div class="header">
      <div class="brand">
        <div class="logo-badge">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
        </div>
        <div>
          <div class="brand-title">staySphere</div>
          <div class="brand-sub">Official Booking Invoice & Travel Voucher</div>
        </div>
      </div>
      <div style="text-align: right;">
        <span class="status-badge">Paid &amp; Confirmed</span>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 6px;">Receipt #${invoiceId}</div>
      </div>
    </div>

    <div class="grid-2">
      <div class="info-box">
        <h4>Reservation Details</h4>
        <div class="info-row">
          <span class="info-label">Confirmation ID</span>
          <span class="info-val" style="font-family: monospace;">${booking._id || "N/A"}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Check-in</span>
          <span class="info-val">${checkIn}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Check-out</span>
          <span class="info-val">${checkOut}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Length of Stay</span>
          <span class="info-val">${nights} night(s)</span>
        </div>
        <div class="info-row">
          <span class="info-label">Guests</span>
          <span class="info-val">${booking.guestsCount || 1} guest(s)</span>
        </div>
      </div>

      <div class="info-box">
        <h4>Stay &amp; Host Information</h4>
        <div class="info-row">
          <span class="info-label">Property</span>
          <span class="info-val">${listing.title || "StaySphere Property"}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Destination</span>
          <span class="info-val">${listing.location || ""}, ${listing.country || ""}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Host</span>
          <span class="info-val">${listing.owner?.username || "Verified Host"}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Booked By</span>
          <span class="info-val">${user.username || "Guest"}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Email</span>
          <span class="info-val">${user.email || "customer@staysphere.com"}</span>
        </div>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Item Description</th>
            <th>Rate / Breakdown</th>
            <th class="num">Amount (INR)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Nightly Accommodation</strong></td>
            <td>${nights} night(s) &times; &#8377;${pricePerNight.toLocaleString("en-IN")}/night</td>
            <td class="num">&#8377;${subtotal.toLocaleString("en-IN")}</td>
          </tr>
          <tr>
            <td><strong>Cleaning Fee</strong></td>
            <td>Standard turnaround and linen service</td>
            <td class="num">&#8377;${cleaningFee.toLocaleString("en-IN")}</td>
          </tr>
          <tr>
            <td><strong>StaySphere Guest Service Fee</strong></td>
            <td>24/7 emergency support and property protection</td>
            <td class="num">&#8377;${serviceFee.toLocaleString("en-IN")}</td>
          </tr>
          <tr>
            <td><strong>Taxes &amp; Levies</strong></td>
            <td>18% Goods and Services Tax (GST)</td>
            <td class="num">&#8377;${taxes.toLocaleString("en-IN")}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="total-banner">
      <div>
        <div class="total-title">Total Amount Paid</div>
        <div class="total-sub">Includes all taxes, fees, and accommodation costs</div>
      </div>
      <div class="total-price">&#8377;${total.toLocaleString("en-IN")}</div>
    </div>

    <div class="rules">
      <strong>Cancellation &amp; Check-In Policy:</strong> Free cancellation up to 48 hours prior to check-in time. Check-in starts at 3:00 PM. Please present this voucher and a government-issued photo ID upon arrival.
    </div>

    <div class="footer">
      StaySphere Inc. &bull; Online Travel Marketplace &bull; support@staysphere.com &bull; https://stayspherefrontend.vercel.app
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 350);
    };
  </script>
</body>
</html>`;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  }
}
