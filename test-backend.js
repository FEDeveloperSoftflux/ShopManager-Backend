const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('=== Backend API Diagnostic Test ===\n');

  // Test 1: Check server connectivity
  try {
    const itemsRes = await fetch(`${BASE_URL}/items`);
    if (itemsRes.ok) {
      console.log('✅ Server Connectivity: SUCCESS (Connection established)');
    }
  } catch (err) {
    console.error('❌ Server Connectivity: FAILED');
    console.error(`   Error message: ${err.message}`);
    console.log('\n⚠️  Please make sure your backend server is running (npm run dev) on port 5000 first!');
    process.exit(1);
  }

  // Test 2: Cashier Login API
  try {
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'ali.raza@shopmanager.com',
        password: 'password123'
      })
    });
    
    if (loginRes.ok) {
      const user = await loginRes.json();
      console.log(`✅ Cashier Login API: SUCCESS (Logged in as ${user.name} - ${user.role})`);
    } else {
      const err = await loginRes.json();
      console.log(`❌ Cashier Login API: FAILED (${err.error})`);
    }
  } catch (err) {
    console.log(`❌ Cashier Login API: ERROR (${err.message})`);
  }

  // Test 3: Fetch Items List
  let testItemId = `ITM-TEST-${Math.floor(100 + Math.random() * 900)}`;
  try {
    const itemsRes = await fetch(`${BASE_URL}/items`);
    if (itemsRes.ok) {
      const items = await itemsRes.json();
      console.log(`✅ Get Items API: SUCCESS (Retrieved ${items.length} items from database)`);
    } else {
      console.log('❌ Get Items API: FAILED');
    }
  } catch (err) {
    console.log(`❌ Get Items API: ERROR (${err.message})`);
  }

  // Test 4: Save / Add New Item
  try {
    const createRes = await fetch(`${BASE_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: testItemId,
        name: `Diagnostic Test Product ${Math.floor(Math.random() * 1000)}`,
        category: 'Groceries',
        costPrice: 50,
        sellingPrice: 75,
        margin: 33.3,
        barcode: `TESTBAR-${Math.floor(100000 + Math.random() * 900000)}`,
        description: 'Automatic test item',
        tags: ['test', 'diagnostic'],
        images: [],
        status: 'Active'
      })
    });

    if (createRes.ok) {
      console.log(`✅ Add Item API: SUCCESS (Created test item ${testItemId})`);
    } else {
      const err = await createRes.json();
      console.log(`❌ Add Item API: FAILED (${err.error})`);
    }
  } catch (err) {
    console.log(`❌ Add Item API: ERROR (${err.message})`);
  }

  // Test 5: Delete Item API
  try {
    const deleteRes = await fetch(`${BASE_URL}/items/${testItemId}`, {
      method: 'DELETE'
    });
    if (deleteRes.ok) {
      console.log(`✅ Delete Item API: SUCCESS (Cleaned up test item ${testItemId})`);
    } else {
      console.log('❌ Delete Item API: FAILED');
    }
  } catch (err) {
    console.log(`❌ Delete Item API: ERROR (${err.message})`);
  }

  // Test 6: Invoices API
  try {
    const invoiceRes = await fetch(`${BASE_URL}/invoices`);
    if (invoiceRes.ok) {
      const invoices = await invoiceRes.json();
      console.log(`✅ Get Invoices API: SUCCESS (Retrieved ${invoices.length} records)`);
    } else {
      console.log('❌ Get Invoices API: FAILED');
    }
  } catch (err) {
    console.log(`❌ Get Invoices API: ERROR (${err.message})`);
  }

  console.log('\n=== Diagnostic Run Finished ===');
}

runTests();
