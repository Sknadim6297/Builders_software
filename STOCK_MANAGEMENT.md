# Stock Management System Documentation

## Overview
The Stock Management System is a **read-only, automated inventory tracking system** that is fully integrated with the Purchase Bill system. Stock is automatically updated when items are purchased through purchase bills. Users cannot manually add, edit, or delete stock items - they can only view stock levels and movement history.

## Key Features

### 🔒 **Read-Only System**
- **No Manual Stock Entry**: Stock cannot be manually added, edited, or deleted
- **Automatic Updates Only**: Stock is updated automatically when purchase bills are created
- **View-Only Access**: Users can only view stock levels and movement history
- **Audit Trail**: Complete history of all stock movements with source tracking

### 📈 **Automatic Stock Updates**
- **Purchase Bill Integration**: When a purchase bill is created, all items are automatically added to stock
- **Smart Item Recognition**: If an item already exists, quantities are updated using weighted average costing
- **New Item Creation**: New items are automatically created when first purchased
- **Movement Tracking**: Every stock change is recorded with full details

### 📊 **Stock Information Display**
- **Current Quantities**: Real-time stock levels for all items
- **Financial Values**: Unit costs and total stock values
- **Movement History**: Complete audit trail of all stock changes
- **Source Tracking**: Shows which purchase bills contributed to stock
- **Low Stock Alerts**: Visual warnings for items below reorder levels

## How It Works

### Purchase Bill → Stock Flow
1. User creates a purchase bill with items
2. System automatically checks if each item exists in stock
3. If item doesn't exist, creates new stock record
4. If item exists, updates quantity using weighted average costing
5. Creates stock movement record linking to purchase bill
6. Updates total stock value

### Stock Movement Types
- **IN**: Stock increases (from purchases, adjustments)
- **OUT**: Stock decreases (from sales, adjustments)  
- **ADJUSTMENT**: Manual stock adjustments

### Weighted Average Costing
The system uses weighted average costing to calculate unit costs:
- Current Value = Current Quantity × Current Unit Cost
- New Value = New Quantity × New Unit Cost
- New Unit Cost = (Current Value + New Value) ÷ (Current Quantity + New Quantity)

## Usage Guide

### Accessing Stock Management
1. Navigate to the sidebar menu
2. Click on "Stock Management" (requires `stock_management` permission)
3. View all inventory items with current quantities and values
4. **Note**: All stock data is read-only and automatically managed

### How Stock Gets Updated
1. Go to "Manage Purchase Bill" → "Create Purchase Bill"
2. Add items with:
   - Product name
   - Description
   - Quantity
   - Unit price
   - Measurement unit (kg, pcs, etc.)
3. Save the purchase bill
4. **Items are automatically added to stock** - no manual intervention required

### Viewing Stock Information
- **Search**: Filter items by name or description
- **Low Stock Filter**: Show only items below reorder level
- **Stock Details**: Click "View Details" to see complete movement history
- **Status Indicators**: Green for sufficient stock, red for low stock
- **Movement History**: View all stock movements with dates, sources, and purchase bill references

### Stock Movement Details
- **Date & Time**: When the stock movement occurred
- **Type**: IN (from purchases), OUT (from sales), ADJUSTMENT (manual corrections)
- **Quantity**: Amount moved in or out
- **Source**: Reference to purchase bill or other source
- **Running Balance**: Stock level after the movement
- **User**: Who initiated the movement (system for automatic updates)

## Database Schema

### Stocks Table
- `id`: Primary key
- `item_name`: Name of the item
- `item_description`: Optional description
- `unit`: Measurement unit (kg, pcs, etc.)
- `quantity_on_hand`: Current stock quantity
- `unit_cost`: Weighted average unit cost
- `total_value`: Total stock value (quantity × unit cost)
- `reorder_level`: Minimum stock level
- `supplier_info`: Supplier details
- `location`: Storage location
- `last_updated_by`: User who last updated the record

### Stock Movements Table
- `id`: Primary key
- `stock_id`: Foreign key to stocks table
- `movement_type`: 'in', 'out', or 'adjustment'
- `quantity`: Quantity moved
- `unit_cost`: Unit cost for this movement
- `total_cost`: Total cost for this movement
- `reference_type`: 'purchase_bill', 'sale', or 'adjustment'
- `reference_id`: ID of the related record
- `notes`: Additional notes
- `created_by`: User who created the movement

## Permissions
- `stock_management`: Required to access stock management features
- Users with `purchase_bills` permission can indirectly affect stock through purchase bills

## Technical Implementation

### Models
- `Stock`: Main inventory model with relationships to movements
- `StockMovement`: Individual stock movement records
- `PurchaseBill`: Integration with purchase bill system

### Controllers
- `StockController`: CRUD operations for stock management
- `PurchaseBillController`: Includes automatic stock updates

### React Components
- `Stock/Index.jsx`: Stock listing with search and filters (read-only)
- `Stock/Show.jsx`: Stock details and movement history (read-only)
- ~~`Stock/Create.jsx`~~: Removed - no manual stock creation
- ~~`Stock/Edit.jsx`~~: Removed - no manual stock editing
- ~~`Stock/Adjust.jsx`~~: Removed - no manual stock adjustments

## System Limitations & Rules
- ❌ **No Manual Stock Entry**: Users cannot manually add stock items
- ❌ **No Stock Editing**: Existing stock items cannot be manually modified
- ❌ **No Stock Deletion**: Stock items cannot be deleted manually
- ❌ **No Manual Adjustments**: Stock quantities cannot be manually adjusted
- ✅ **View Only**: Users can view stock levels and movement history
- ✅ **Automatic Updates**: Stock is updated automatically from purchase bills
- ✅ **Search & Filter**: Users can search and filter stock items
- ✅ **Movement History**: Complete audit trail is always available

## Future Enhancements
- Sales integration for automatic stock decreases
- Barcode/QR code support for easier item identification
- Advanced stock reports and analytics
- Multi-location inventory tracking
- Automatic reorder notifications and purchase suggestions
- Integration with supplier systems for automated ordering

## Notes
- All monetary values are displayed in Indian Rupees (₹)
- Stock quantities support decimal values for precise measurements
- System maintains complete audit trail of all stock movements
- Stock values are calculated using weighted average costing method
