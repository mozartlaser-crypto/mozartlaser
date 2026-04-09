// js/create.js
// ============================
// CREATE.JS — Fully Fixed Version
// ============================

document.addEventListener('DOMContentLoaded', () => {

  // ---------------------
  // State & helpers
  // ---------------------
  let currentPrice = 20;
  let selectedFont = ''; 
  const $ = (sel) => document.querySelector(sel);

  function addToCartVisual(productName, price) {
    if (window.addToCart) window.addToCart(productName, price);
    else console.warn("cart.js not loaded yet");
  }

  // ---------------------
  // Elements
  // ---------------------
  const steps = Array.from(document.querySelectorAll('.step'));
  const modeCustomize = $('#mode-customize');
  const modeFull = $('#mode-full');
  const selectExisting = $('#select-existing');

  const uploadFileInput = $('#upload-file');
  const uploadFileCustom = $('#upload-file-custom');
  const deleteFileBtn = $('#delete-file');
  const deleteFileCustom = $('#delete-file-custom');

  const filePlacementInput = $('#file-placement');
  const filePlacementCustom = $('#file-placement-custom');

  const textField = $('#custom-text');
  const fontSelect = $('#font-select');
  const textSizeSelect = $('#font-size-select'); // fixed reference
  const textLocation = $('#text-location');
  const customChanges = $('#custom-changes');

  const selectedProductTextFull = $('#selected-product-text-full');
  const selectedProductTextCustom = $('#selected-product-text');

  const productPreviewFull = $('#product-preview-full');
  const productPreviewCustom = $('#product-preview-custom');

  const sendForm = $('#sendForm');

  const hiddenFlowType = $('#f-flow-type');
  const hiddenProduct = $('#f-product');
  const hiddenText = $('#f-text');
  const hiddenFont = $('#f-font');
  const hiddenTextSize = $('#f-font-size');
  const hiddenLocation = $('#f-location');
  const hiddenFilePlacement = $('#f-file-placement');
  const hiddenSelectedProduct = $('#f-selected-product');
  const hiddenCustomChanges = $('#f-custom-changes');
  const hiddenCustomFilePlacement = $('#f-custom-file-placement');
  const hiddenPrice = $('#f-price');
  const hiddenEmail = $('#f-email');

  // ---------------------
  // Product prices & images
  // ---------------------
  const existingProductPrices = {
    "Wooden Dove Plaque - Psalm 46:5": 34.99,
    "Cross Design with Bible Verse": 34.99,
    "Detailed Classic Train Engraving": 29.99,
    "“Wings Like Eagles” - Isaiah 40:31 Wooden Eagle Plaque": 34.99,
    "“Be Still” Psalm 46:10 – Wooden Sword Scripture Plaque": 24.99,
	  "Wooden Cutting Board with Ship":79.99,
	  "Golden Gate Bridge Plaque":41.99,
	  "Custom Animal Plaque":24.99,
	  "Avalon Bay, Catalina Island Laser Engraved Plaque": 19.99,
	  "Big Ben Plaque": 20.99,

  };

  const fullCustomPrices = {
    "Wooden Plaque (Horizontal)": 22.99,
    "Wooden Plaque (Vertical)": 19.99,
	  "Custom Bookmark": 6.99,
	  "Wooden Coaster":8.99,
    "Custom Leather Wallet": 22.99,
  };

  const productImages = {
   	"Wooden Dove Plaque - Psalm 46:5":"Product Images/Dove with Psalm/Front view.jpg",
	 "Cross Design with Bible Verse": "Product Images/Rose on Cross/Front view.jpg",
    "Detailed Classic Train Engraving": "Product Images/Train/Front-view.jpg",
   "“Wings Like Eagles” - Isaiah 40:31 Wooden Eagle Plaque": "Product Images/Eagle with Isaiah/Front view.jpg",
	 "“Be Still” Psalm 46:10 – Wooden Sword Scripture Plaque": "Product Images/Sword with Psalm/Front view.jpg",
	  "Wooden Cutting Board with Ship": "Product Images/Ship/Front view.jpg",
	  "Golden Gate Bridge Plaque":"Product Images/Golden Gate Bridge/Front view.jpg",
	  "Custom Animal Plaque": "Product Images/Animal Plaque/Display.JPG",
	  "Avalon Bay, Catalina Island Laser Engraved Plaque":"Product Images/Catalina/Front view.jpg",
	  "Big Ben Plaque": "Product Images/Big Ben Plaque/Front view.jpg",
	  
    "Wooden Plaque (Horizontal)": "Product Images/Blank Samples/Horizontal.png",
    "Wooden Plaque (Vertical)": "Product Images/Blank Samples/Vertical.png",
	 "Custom Bookmark":"Product Images/Blank Samples/Bookmark.png",
	  "Wooden Coaster": "Product Images/Blank Samples/Coaster.png",
    "Custom Leather Wallet": "Product Images/Blank Samples/Wallet.jpg",
  };

  // ---------------------
  // Utility functions
  // ---------------------
  function showStep(stepId) {
    steps.forEach(s => s.classList.remove('active'));
    const el = document.getElementById(stepId);
    if (el) el.classList.add('active');
    window.scrollTo(0, 0);
  }

  function updatePrice() {
    const product = selectExisting?.value || '';
    if (modeFull?.checked) currentPrice = fullCustomPrices[product] ?? 34.99;
    else if (modeCustomize?.checked) currentPrice = existingProductPrices[product] ?? 20.00;
    else currentPrice = 20.00;

    $('#total-price') && ($('#total-price').textContent = `Total: $${currentPrice}`);
    $('#total-price-custom') && ($('#total-price-custom').textContent = `Total: $${currentPrice}`);
  }

  function populateSelectForMode() {
    if (!selectExisting) return;
    let html = '';
    if (modeFull?.checked) {
      html = '<option value="">-- Choose a Custom Product --</option>';
      for (const p in fullCustomPrices) html += `<option value="${p}">${p}</option>`;
    } else if (modeCustomize?.checked) {
      html = '<option value="">-- Select Product --</option>';
      for (const p in existingProductPrices) html += `<option value="${p}">${p}</option>`;
    }
    selectExisting.innerHTML = html;
    updatePrice();
  }

  function updateSelectedProductDisplay() {
    const name = selectExisting?.value || 'None';
    if (modeFull?.checked) {
      selectedProductTextFull.textContent = name;
      productPreviewFull.src = productImages[name] || 'images/placeholder.png';
    } else if (modeCustomize?.checked) {
      selectedProductTextCustom.textContent = name;
      productPreviewCustom.src = productImages[name] || 'images/placeholder.png';
    }
    updatePrice();
  }

  function copyFileIntoHiddenInput(input) {
    if (!sendForm) return;
    const fileField = sendForm.querySelector('input[type="file"]');
    if (!fileField) return;
    if (input?.files?.length > 0) {
      const dt = new DataTransfer();
      dt.items.add(input.files[0]);
      fileField.files = dt.files;
    } else {
      try { fileField.value = ''; } catch (e) {}
    }
  }

  function escapeHtml(str) {
    return String(str || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  // ---------------------
  // Validation
  // ---------------------
  function validateFullStep2() {
    const text = textField?.value.trim() || '';
    const font = selectedFont;
    const size = textSizeSelect?.value || '';
    const loc = textLocation?.value.trim() || '';
    const hasFile = uploadFileInput?.files?.length > 0;
    const filePlacement = filePlacementInput?.value.trim() || '';

    if (!text && !hasFile) { alert('Enter text or upload a file.'); return false; }
    if (text && (!font || !size || !loc)) { alert('Font, size, and placement required for text.'); return false; }
    if (hasFile && !filePlacement) { alert('Describe where the uploaded file should be placed.'); return false; }
    return true;
  }

  function validateCustomStep2() {
    const selected = selectExisting?.value || '';
    const changes = customChanges?.value.trim() || '';
    const hasFile = uploadFileCustom?.files?.length > 0;
    if (!selected) { alert('Select a product to customize.'); return false; }
    if (!changes && !hasFile) { alert('Describe changes or upload a file.'); return false; }
    return true;
  }

  function populateStep3Summary() {
    const s = $('#summary');
    if (s) {
      const text = textField?.value.trim() || 'None';
      const font = selectedFont || 'None';
      const size = textSizeSelect?.value || 'None';
      const loc = textLocation?.value.trim() || 'None';
      const fileName = uploadFileInput?.files?.[0]?.name || 'None';
      const placementVal = filePlacementInput?.value.trim() || 'None';
      s.innerHTML = `
        <p><strong>Engraved Text:</strong> ${escapeHtml(text)}</p>
        <p><strong>Font:</strong> ${escapeHtml(font)}</p>
        <p><strong>Text Size:</strong> ${escapeHtml(size)}</p>
        <p><strong>Text Placement:</strong> ${escapeHtml(loc)}</p>
        <p><strong>File Placement:</strong> ${escapeHtml(placementVal)}</p>
        <p><strong>Uploaded File:</strong> ${escapeHtml(fileName)}</p>
        <p><strong>Price:</strong> $${currentPrice}</p>
      `;
    }

    const sc = $('#summary_custom');
    if (sc) {
      const sel = selectExisting?.value || 'None';
      const changes = customChanges?.value.trim() || 'None';
      const fileName = uploadFileCustom?.files?.[0]?.name || 'None';
      const placement = filePlacementCustom?.value.trim() || 'None';
      sc.innerHTML = `
        <p><strong>Selected Product:</strong> ${escapeHtml(sel)}</p>
        <p><strong>Requested Changes:</strong> ${escapeHtml(changes)}</p>
        <p><strong>Uploaded File:</strong> ${escapeHtml(fileName)}</p>
        <p><strong>File Placement:</strong> ${escapeHtml(placement)}</p>
        <p><strong>Price:</strong> $${currentPrice}</p>
      `;
    }
  }

  // ---------------------
  // Step navigation
  // ---------------------
  document.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.next-step, .prev-step');
    if (!btn) return;
    ev.preventDefault();

    if (btn.classList.contains('next-step')) {
      if (btn.id === 'step1-next') {
        if (!selectExisting?.value) return alert('Select a product.');
        if (modeCustomize?.checked) showStep('step2_custom');
        else showStep('step2');
        return;
      }
      const nextId = btn.getAttribute('data-next');
      if (nextId === 'step3' && !validateFullStep2()) return;
      if (nextId === 'step3_custom' && !validateCustomStep2()) return;
      if (nextId) { showStep(nextId); populateStep3Summary(); }
    }

    if (btn.classList.contains('prev-step')) {
      const prevId = btn.getAttribute('data-prev');
      if (prevId) showStep(prevId);
    }
  });

  // ---------------------
  // File delete buttons
  // ---------------------
  deleteFileBtn?.addEventListener('click', () => uploadFileInput.value = '');
  deleteFileCustom?.addEventListener('click', () => uploadFileCustom.value = '');

  // ---------------------
  // Mode toggle listeners
  // ---------------------
  modeCustomize?.addEventListener('change', populateSelectForMode);
  modeFull?.addEventListener('change', populateSelectForMode);
  selectExisting?.addEventListener('change', updateSelectedProductDisplay);

  // ---------------------
  // Add to cart functions
  // ---------------------
  function resetAllFields() {
    textField.value = '';
    textLocation.value = '';
    textSizeSelect.value = '';
    customChanges.value = '';
    selectExisting.value = '';
    uploadFileInput.value = '';
    uploadFileCustom.value = '';
    filePlacementInput.value = '';
    filePlacementCustom.value = '';
    selectedFont = '';
    $('#verify-email') && ($('#verify-email').value = '');
    $('#verify-email-confirm') && ($('#verify-email-confirm').value = '');
    $('#verify-email-custom') && ($('#verify-email-custom').value = '');
    $('#verify-email-confirm-custom') && ($('#verify-email-confirm-custom').value = '');
    $('#verify-name') && ($('#verify-name').value = '');
    $('#verify-name-custom') && ($('#verify-name-custom').value = '');
    selectedProductTextFull.textContent = 'None';
    selectedProductTextCustom.textContent = 'None';
    productPreviewFull.src = 'images/placeholder.png';
    productPreviewCustom.src = 'images/placeholder.png';
    $('#summary') && ($('#summary').innerHTML = '');
    $('#summary_custom') && ($('#summary_custom').innerHTML = '');
    updatePrice();
  }

  $('#add-to-cart-full')?.addEventListener('click', () => {
    const name = $('#verify-name')?.value.trim();
    const email = $('#verify-email')?.value.trim();
    const emailConfirm = $('#verify-email-confirm')?.value.trim();
    if (!name || !email) return alert('Enter name and email.');
    if (email !== emailConfirm) return alert('Emails do not match.');
    if (!validateFullStep2()) return;

    const textSize = textSizeSelect?.value || 'None';
    const fullCustomizations = `
Text: ${textField?.value || 'None'},
Font: ${selectedFont || 'None'},
Size: ${textSize},
Placement: ${textLocation?.value || 'None'},
File Placement: ${filePlacementInput?.value || 'None'},
File: ${uploadFileInput?.files?.[0]?.name || 'None'}
`;

    addToCartVisual(`${selectExisting?.value || 'Custom Product'} — ${fullCustomizations}`, currentPrice);

    hiddenFlowType.value = 'create-your-own';
    hiddenProduct.value = selectExisting?.value || '';
    hiddenText.value = textField?.value || '';
    hiddenFont.value = selectedFont || '';
    hiddenTextSize.value = textSize;
    hiddenLocation.value = textLocation?.value || '';
    hiddenFilePlacement.value = filePlacementInput?.value || '';
    hiddenPrice.value = `$${currentPrice}`;
    hiddenEmail.value = email;
    copyFileIntoHiddenInput(uploadFileInput);
    sendForm?.submit();

    alert('Your custom product has been added to the Cart! If you proceed with your order, an email with a sample design of your customization will be sent to you within 1 business day. YOU MUST RESPOND within 3 business days or your order will be automatically refunded!');
    resetAllFields();
    showStep('step1');
  });

  $('#add-to-cart-custom')?.addEventListener('click', () => {
    const name = $('#verify-name-custom')?.value.trim();
    const email = $('#verify-email-custom')?.value.trim();
    const emailConfirm = $('#verify-email-confirm-custom')?.value.trim();
    if (!name || !email) return alert('Enter name and email.');
    if (email !== emailConfirm) return alert('Emails do not match.');
    if (!validateCustomStep2()) return;

    const customCustomizations = `
Changes: ${customChanges?.value || 'None'},
File: ${uploadFileCustom?.files?.[0]?.name || 'None'},
Placement: ${filePlacementCustom?.value || 'None'}
`;

    addToCartVisual(`${selectExisting?.value || 'Custom Product'} — ${customCustomizations}`, currentPrice);

    hiddenFlowType.value = 'customize';
    hiddenSelectedProduct.value = selectExisting?.value || '';
    hiddenCustomChanges.value = customChanges?.value || '';
    hiddenCustomFilePlacement.value = filePlacementCustom?.value || '';
    hiddenPrice.value = `$${currentPrice}`;
    hiddenEmail.value = email;
    copyFileIntoHiddenInput(uploadFileCustom);
    sendForm?.submit();

    alert('Your customization has been added to the Cart! If you proceed with your order, an email with a sample design of your customization will be sent to you within 1 business day. YOU MUST RESPOND within 3 business days or your order will be automatically refunded!');
    resetAllFields();
    showStep('step1');
  });

  // ---------------------
  // Custom font dropdown
  // ---------------------
  function createFontDropdown() {
    if (!fontSelect) return;
    const select = fontSelect;
    const container = document.createElement('div');
    container.classList.add('custom-select');
    select.style.display = 'none';

    const selectedDiv = document.createElement('div');
    selectedDiv.classList.add('select-selected');
    selectedDiv.textContent = select.options[select.selectedIndex]?.text || 'Choose a font';
    selectedFont = select.options[select.selectedIndex]?.text || '';
    container.appendChild(selectedDiv);

    const optionsDiv = document.createElement('div');
    optionsDiv.classList.add('select-items', 'select-hide');

    for (let i = 0; i < select.options.length; i++) {
      const option = select.options[i];
      const optionDiv = document.createElement('div');
      optionDiv.textContent = option.text;
      optionDiv.style.fontFamily = option.value ? (option.value.includes(' ') ? `'${option.value}'` : option.value) : '';
      if (!option.value) optionDiv.style.color = '#999';
      optionDiv.addEventListener('click', () => {
        select.selectedIndex = i;
        select.value = option.value;
        selectedDiv.textContent = option.text;
        selectedDiv.style.fontFamily = option.value ? optionDiv.style.fontFamily : '';
        selectedFont = option.text; 
        closeAllSelect();
      });
      optionsDiv.appendChild(optionDiv);
    }

    container.appendChild(optionsDiv);
    select.parentNode.insertBefore(container, select.nextSibling);

    selectedDiv.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllSelect(selectedDiv);
      optionsDiv.classList.toggle('select-hide');
      selectedDiv.classList.toggle('select-arrow-active');
    });

    function closeAllSelect(except) {
      document.querySelectorAll('.select-items').forEach(el => { if (el.previousSibling !== except) el.classList.add('select-hide'); });
      document.querySelectorAll('.select-selected').forEach(el => { if (el !== except) el.classList.remove('select-arrow-active'); });
    }

    document.addEventListener('click', closeAllSelect);
  }
  createFontDropdown();
// ---------------------
// URL bootstrap (IMPORTANT)
// ---------------------
function bootstrapFromURL() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode');
  const product = params.get('product');
  const step = params.get('step');

  if (mode === 'template') {
    modeCustomize.checked = true;
    modeFull.checked = false;
  } else if (mode === 'full') {
    modeFull.checked = true;
    modeCustomize.checked = false;
  }

  populateSelectForMode();

  if (product && selectExisting) {
    selectExisting.value = product;
    updateSelectedProductDisplay();
  }

  if (step === '2') {
    if (mode === 'template') {
      showStep('step2_custom');
    } else {
      showStep('step2');
    }
  } else {
    showStep('step1');
  }
}
  // ---------------------
  // Startup
  // ---------------------
  bootstrapFromURL();
});