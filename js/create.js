// js/create.js
// ============================
// CREATE.JS — Updated fully with all requested changes
// ============================

document.addEventListener('DOMContentLoaded', () => {

  // ---------------------
  // State & helpers
  // ---------------------
  let currentPrice = 20;
  const $ = (sel) => document.querySelector(sel);

  function addToCartVisual(productName, price) {
    if (window.addToCart) window.addToCart(productName, price);
    else console.warn("cart.js not loaded yet");
  }

  // ---------------------
  // Elements
  // ---------------------
  const steps = Array.from(document.querySelectorAll('.step'));
  const modeCustomize = $('#mode-customize'); // customize existing
  const modeFull = $('#mode-full');           // create your own / full custom
  const selectExisting = $('#select-existing');
  const uploadFileInput = $('#upload-file');
  const uploadFileCustom = $('#upload-file-custom');
  const deleteFileBtn = $('#delete-file');
  const deleteFileCustom = $('#delete-file-custom');
  const filePlacementInput = $('#file-placement');
  const filePlacementCustom = $('#file-placement-custom');
  const textField = $('#custom-text');
  const fontSelect = $('#font-select');
  const textLocation = $('#text-location');
  const customChanges = $('#custom-changes');
  const selectedProductTextFull = $('#selected-product-text-full');
  const selectedProductTextCustom = $('#selected-product-text');
  const productPreviewFull = $('#product-preview-full');
  const productPreviewCustom = $('#product-preview-custom');
  const sendForm = $('#sendForm');

  // Hidden fields
  const hiddenFlowType = $('#f-flow-type');
  const hiddenProduct = $('#f-product');
  const hiddenText = $('#f-text');
  const hiddenFont = $('#f-font');
  const hiddenLocation = $('#f-location');
  const hiddenFilePlacement = $('#f-file-placement');
  const hiddenSelectedProduct = $('#f-selected-product');
  const hiddenCustomChanges = $('#f-custom-changes');
  const hiddenCustomFilePlacement = $('#f-custom-file-placement');
  const hiddenPrice = $('#f-price');
  const hiddenEmail = $('#f-email');

  // ---------------------
  // Product prices
  // ---------------------
  const existingProductPrices = {
    "Cross with Scripture": 34.99,
    "Train Plaque": 29.99,
    "Leather Wallet": 44.99
  };

  const fullCustomPrices = {
    "Wooden Plaque (Horizontal)": 39.99,
    "Wooden Plaque (Vertical)": 34.99,
    "Custom Leather Wallet": 44.99
  };

  const productImages = {
    "Cross with Scripture": "images/cross.png",
    "Train Plaque": "images/train.png",
    "Leather Wallet": "images/wallet.png",
    "Wooden Plaque (Horizontal)": "images/placeholder.png",
    "Wooden Plaque (Vertical)": "images/placeholder.png",
    "Custom Leather Wallet": "images/placeholder.png"
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
    if (modeFull?.checked) {
      currentPrice = fullCustomPrices[product] ?? 34.99;
    } else if (modeCustomize?.checked) {
      currentPrice = existingProductPrices[product] ?? 20.00;
    } else {
      currentPrice = 20.00;
    }

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

  function validateFullStep2() {
    const text = textField?.value.trim() || '';
    const font = fontSelect?.value || '';
    const loc = textLocation?.value.trim() || '';
    const hasFile = uploadFileInput?.files?.length > 0;

    if (!text && !hasFile) { alert('Enter text or upload a file.'); return false; }
    if (text && (!font || !loc)) { alert('Font and placement required for text.'); return false; }
    if (hasFile && !filePlacementInput?.value.trim()) { alert('Describe where the uploaded file should be placed.'); return false; }
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
      const font = fontSelect?.value || 'None';
      const loc = textLocation?.value.trim() || 'None';
      const fileName = uploadFileInput?.files?.[0]?.name || 'None';
      s.innerHTML = `
        <p><strong>Engraved Text:</strong> ${escapeHtml(text)}</p>
        <p><strong>Font:</strong> ${escapeHtml(font)}</p>
        <p><strong>Text Placement:</strong> ${escapeHtml(loc)}</p>
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
  // Add to cart
  // ---------------------
  function resetAllFields() {
    textField.value = '';
    textLocation.value = '';
    customChanges.value = '';
    selectExisting.value = '';
    uploadFileInput.value = '';
    uploadFileCustom.value = '';
    filePlacementInput.value = '';
    filePlacementCustom.value = '';
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

    addToCartVisual(selectExisting?.value || 'Custom Product', currentPrice);

    hiddenFlowType.value = 'create-your-own';
    hiddenProduct.value = selectExisting?.value || '';
    hiddenText.value = textField?.value || '';
    hiddenFont.value = fontSelect?.value || '';
    hiddenLocation.value = textLocation?.value || '';
    hiddenFilePlacement.value = filePlacementInput?.value || '';
    hiddenPrice.value = `$${currentPrice}`;
    hiddenEmail.value = email;
    copyFileIntoHiddenInput(uploadFileInput);
    sendForm?.submit();

    alert('Your custom product has been added to the Cart!');
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

    addToCartVisual(selectExisting?.value || 'Custom Product', currentPrice);

    hiddenFlowType.value = 'customize';
    hiddenSelectedProduct.value = selectExisting?.value || '';
    hiddenCustomChanges.value = customChanges?.value || '';
    hiddenCustomFilePlacement.value = filePlacementCustom?.value || '';
    hiddenPrice.value = `$${currentPrice}`;
    hiddenEmail.value = email;
    copyFileIntoHiddenInput(uploadFileCustom);
    sendForm?.submit();

    alert('Your customization has been added to the Cart!');
    resetAllFields();
    showStep('step1');
  });

  // ---------------------
  // Font dropdown (same as before)
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
        select.dispatchEvent(new Event('change'));
        selectedDiv.textContent = option.text;
        selectedDiv.style.fontFamily = option.value ? optionDiv.style.fontFamily : '';
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
  // Startup
  // ---------------------
  populateSelectForMode();
  updateSelectedProductDisplay();
  showStep('step1');

});