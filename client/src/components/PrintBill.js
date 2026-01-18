import React, { forwardRef } from 'react';

const PrintBill = forwardRef(({ sale, shopName = "InvBilling Store" }, ref) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  if (!sale) return null;

  const isOffline = sale.isOffline || sale.sale._id?.startsWith('offline-');
  const subtotal = sale.sale.items.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * 0.18;

  return (
    <div ref={ref} className="print-bill">
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-bill, .print-bill * {
              visibility: visible;
            }
            .print-bill {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              background: white !important;
              color: black !important;
              padding: 20px;
            }
            .no-print {
              display: none !important;
            }
          }
          .print-bill {
            font-family: 'Courier New', monospace;
            max-width: 300px;
            padding: 20px;
            background: white;
            color: black;
          }
          .print-bill .header {
            text-align: center;
            border-bottom: 2px dashed #333;
            padding-bottom: 15px;
            margin-bottom: 15px;
          }
          .print-bill .shop-name {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .print-bill .bill-info {
            font-size: 12px;
            color: #666;
          }
          .print-bill .items {
            margin: 15px 0;
          }
          .print-bill .item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 12px;
          }
          .print-bill .item-name {
            flex: 1;
            max-width: 150px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .print-bill .item-qty {
            width: 40px;
            text-align: center;
          }
          .print-bill .item-price {
            width: 70px;
            text-align: right;
          }
          .print-bill .divider {
            border-top: 1px dashed #333;
            margin: 10px 0;
          }
          .print-bill .totals {
            font-size: 12px;
          }
          .print-bill .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          }
          .print-bill .grand-total {
            font-size: 16px;
            font-weight: bold;
            border-top: 2px solid #333;
            padding-top: 10px;
            margin-top: 10px;
          }
          .print-bill .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 11px;
            color: #666;
          }
          .print-bill .payment-badge {
            display: inline-block;
            background: #000;
            color: #fff;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            text-transform: uppercase;
          }
        `}
      </style>

      <div className="header">
        <div className="shop-name">{shopName}</div>
        <div className="bill-info">
          <div>Bill No: {sale.sale._id.slice(-8).toUpperCase()}</div>
          <div>{formatDate(sale.sale.createdAt)}</div>
        </div>
      </div>

      <div className="items">
        <div className="item" style={{ fontWeight: 'bold', borderBottom: '1px solid #333', paddingBottom: '5px', marginBottom: '10px' }}>
          <span className="item-name">Item</span>
          <span className="item-qty">Qty</span>
          <span className="item-price">Amount</span>
        </div>
        {sale.sale.items.map((item, index) => (
          <div key={index} className="item">
            <span className="item-name">{item.productName}</span>
            <span className="item-qty">x{item.quantity}</span>
            <span className="item-price">{formatCurrency(item.subtotal)}</span>
          </div>
        ))}
      </div>

      <div className="divider"></div>

      <div className="totals">
        <div className="total-row">
          <span>Subtotal:</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="total-row">
          <span>GST (18%):</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <div className="total-row grand-total">
          <span>TOTAL:</span>
          <span>{formatCurrency(sale.sale.totalAmount)}</span>
        </div>
      </div>

      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <span className="payment-badge">
          Paid via {sale.sale.paymentMethod}
        </span>
      </div>

      <div className="footer">
        <div>Thank you for shopping!</div>
        <div>Visit Again</div>
        <div style={{ marginTop: '10px' }}>
          ********************************
        </div>
      </div>
    </div>
  );
});

export default PrintBill;
