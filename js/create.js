// js/create.js

document.addEventListener('DOMContentLoaded', () => {

  // ─────────────────────────────────────────
  // State
  // ─────────────────────────────────────────
  let currentPrice   = 20;
  let selectedFont   = '';
  let orderQty       = 1;
  let orderQtyCustom = 1;

  // ─────────────────────────────────────────
  // DOM shortcuts
  // ─────────────────────────────────────────
  const qs  = (sel) => document.querySelector(sel);
  const get = (id)  => document.getElementById(id);

  const steps               = Array.from(document.querySelectorAll('.step'));
  const modeCustomize       = get('mode-customize');
  const modeFull            = get('mode-full');
  const selectExisting      = get('select-existing');

  const uploadFileInput     = get('upload-file');
  const uploadFileCustom    = get('upload-file-custom');
  const deleteFileBtn       = get('delete-file');
  const deleteFileCustomBtn = get('delete-file-custom');

  const filePlacementInput  = get('file-placement');
  const filePlacementCustom = get('file-placement-custom');

  const textField      = get('custom-text');
  const fontSelect     = get('font-select');
  const textSizeSelect = get('font-size-select');
  const textLocation   = get('text-location');
  const customChanges  = get('custom-changes');
  const additionalNotes = get('additional-notes');

  const selectedProductTextFull   = get('selected-product-text-full');
  const selectedProductTextCustom = get('selected-product-text');
  const productPreviewFull        = get('product-preview-full');
  const productPreviewCustom      = get('product-preview-custom');

  const sendForm = get('sendForm');

  const hiddenFlowType            = get('f-flow-type');
  const hiddenProduct             = get('f-product');
  const hiddenText                = get('f-text');
  const hiddenFont                = get('f-font');
  const hiddenTextSize            = get('f-font-size');
  const hiddenLocation            = get('f-location');
  const hiddenFilePlacement       = get('f-file-placement');
  const hiddenSelectedProduct     = get('f-selected-product');
  const hiddenCustomChanges       = get('f-custom-changes');
  const hiddenCustomFilePlacement = get('f-custom-file-placement');
  const hiddenPrice               = get('f-price');
  const hiddenEmail               = get('f-email');
  const hiddenName                = get('f-name');
  const hiddenQuantity            = get('f-quantity');
  const hiddenAdditionalNotes     = get('f-additional-notes');

  const orderQtyInput       = get('order-qty');
  const qtyApplyBtn         = get('qty-apply');
  const qtyResetBtn         = get('qty-reset');
  const orderQtyInputCustom = get('order-qty-custom');
  const qtyApplyBtnCustom   = get('qty-apply-custom');
  const qtyResetBtnCustom   = get('qty-reset-custom');

  // ─────────────────────────────────────────
  // Product data — single source of truth
  // ─────────────────────────────────────────
  const existingProductPrices = {
    'Wooden Dove Plaque - Psalm 46:5'                   : 19.99,
    'Cross Design with Bible Verse'                      : 15.99,
    'Detailed Classic Train Engraving'                   : 18.99,
    'Wooden Cutting Board with Ship'                     : 79.99,
    'Golden Gate Bridge Plaque'                          : 21.99,
    'Custom Animal Plaque'                               : 24.99,
    'Avalon Bay, Catalina Island Laser Engraved Plaque'  : 19.99,
    'Big Ben Plaque'                                     : 20.99,
  };

  const fullCustomPrices = {
    'Wooden Plaque (Horizontal)' : 22.99,
    'Wooden Plaque (Vertical)'   : 19.99,
    'Custom Wooden Coin'         : 6.99,
    'Custom Bookmark'            : 10.99,
    'Wooden Coaster'             : 8.99,
    'Custom Leather Wallet'      : 22.99,
  };

  // ─────────────────────────────────────────
  // Display names for full custom flow
  // Edit ONLY the values here to rename what
  // the customer sees in the dropdown — keys
  // must stay in sync with fullCustomPrices.
  // ─────────────────────────────────────────
  const fullCustomDisplayNames = {
    'Wooden Plaque (Horizontal)' : 'Custom Horizontal Plaque (10"x8")',
    'Wooden Plaque (Vertical)'   : 'Custom Vertical Plaque (8"x10")',
    'Custom Wooden Coin'         : 'Custom Wooden Coin (2"x2")',
    'Custom Bookmark'            : 'Custom Bookmark (6"x2")',
    'Wooden Coaster'             : 'Custom Coaster (4"x4")',
    'Custom Leather Wallet'      : 'Custom Leather Wallet',
  };

  const productImages = {
    'Wooden Dove Plaque - Psalm 46:5'                   : 'Product Images/Dove with Psalm/Front view.jpg',
    'Cross Design with Bible Verse'                      : 'Product Images/Rose on Cross/Front view.jpg',
    'Detailed Classic Train Engraving'                   : 'Product Images/Train/Front-view.jpg',
    'Wooden Cutting Board with Ship'                     : 'Product Images/Ship/Front view.jpg',
    'Golden Gate Bridge Plaque'                          : 'Product Images/Golden Gate Bridge/Front view.jpg',
    'Custom Animal Plaque'                               : 'Product Images/Animal Plaque/Display.JPG',
    'Avalon Bay, Catalina Island Laser Engraved Plaque'  : 'Product Images/Catalina/Front view.jpg',
    'Big Ben Plaque'                                     : 'Product Images/Big Ben Plaque/Front view.jpg',
    'Wooden Plaque (Horizontal)'                         : 'Product Images/Blank Samples/Horizontal.png',
    'Wooden Plaque (Vertical)'                           : 'Product Images/Blank Samples/Vertical.png',
    'Custom Wooden Coin'                                 : 'Product Images/Blank Samples/coin.jpg',
    'Custom Bookmark'                                    : 'Product Images/Blank Samples/Bookmark.png',
    'Wooden Coaster'                                     : 'Product Images/Blank Samples/Coaster.png',
    'Custom Leather Wallet'                              : 'Product Images/Blank Samples/Wallet.jpg',
  };

  // ─────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────
  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function copyFileIntoHiddenInput(input) {
    if (!sendForm) return;
    const fileField = sendForm.querySelector('input[type="file"]');
    if (!fileField) return;
    if (input && input.files && input.files.length > 0) {
      try { const dt = new DataTransfer(); dt.items.add(input.files[0]); fileField.files = dt.files; } catch(e) {}
    } else {
      try { fileField.value = ''; } catch(e) {}
    }
  }

  // ─────────────────────────────────────────
  // Step navigation
  // ─────────────────────────────────────────
  function showStep(stepId) {
    steps.forEach(s => s.classList.remove('active'));
    const el = get(stepId);
    if (el) el.classList.add('active');
    window.scrollTo(0, 0);
  }

  // ─────────────────────────────────────────
  // Populate product dropdown based on mode
  // ─────────────────────────────────────────
  function populateSelectForMode() {
    if (!selectExisting) return;
    const isFullMode  = modeFull && modeFull.checked;
    const priceMap    = isFullMode ? fullCustomPrices : existingProductPrices;
    const placeholder = isFullMode
      ? '-- Choose a Custom Product --'
      : '-- Select a Product to Customize --';

    let html = `<option value="">${placeholder}</option>`;
    for (const id in priceMap) {
      // value always holds the internal ID; visible text comes from fullCustomDisplayNames
      // for full mode, or the ID itself for customize mode.
      const label = (isFullMode && fullCustomDisplayNames[id]) ? fullCustomDisplayNames[id] : id;
      html += `<option value="${id.replace(/"/g, '&quot;')}">${escapeHtml(label)}</option>`;
    }
    selectExisting.innerHTML = html;
    updatePrice();
  }

  function updateSelectedProductDisplay() {
    const name = selectExisting ? selectExisting.value : '';
    const img  = productImages[name] || 'images/placeholder.png';
    if (modeFull && modeFull.checked) {
      if (selectedProductTextFull)  selectedProductTextFull.textContent = name || 'None';
      if (productPreviewFull)       productPreviewFull.src = img;
    } else {
      if (selectedProductTextCustom) selectedProductTextCustom.textContent = name || 'None';
      if (productPreviewCustom)      productPreviewCustom.src = img;
    }
    updatePrice();
  }

  // ─────────────────────────────────────────
  // Pricing
  // ─────────────────────────────────────────
  function updatePrice() {
    const name = selectExisting ? selectExisting.value : '';
    currentPrice = (modeFull && modeFull.checked)
      ? (fullCustomPrices[name] !== undefined ? fullCustomPrices[name] : 34.99)
      : (existingProductPrices[name] !== undefined ? existingProductPrices[name] : 20.00);
    renderTotalPrice();
  }

  function renderTotalPrice() {
    const elFull = get('total-price');
    if (elFull) {
      const total = (currentPrice * orderQty).toFixed(2);
      elFull.textContent = orderQty > 1
        ? `Total: $${total} (${orderQty} x $${currentPrice.toFixed(2)})`
        : `Total: $${currentPrice.toFixed(2)}`;
    }
    const elCustom = get('total-price-custom');
    if (elCustom) {
      const total = (currentPrice * orderQtyCustom).toFixed(2);
      elCustom.textContent = orderQtyCustom > 1
        ? `Total: $${total} (${orderQtyCustom} x $${currentPrice.toFixed(2)})`
        : `Total: $${currentPrice.toFixed(2)}`;
    }
  }

  // ─────────────────────────────────────────
  // Validation
  // ─────────────────────────────────────────
  function validateStep1() {
    if (!selectExisting || !selectExisting.value) {
      alert('Please select a product before continuing.');
      return false;
    }
    return true;
  }

  function validateFullStep2() {
    const text     = textField       ? textField.value.trim()       : '';
    const font     = selectedFont;
    const size     = textSizeSelect  ? textSizeSelect.value         : '';
    const loc      = textLocation    ? textLocation.value.trim()    : '';
    const hasFile  = uploadFileInput && uploadFileInput.files && uploadFileInput.files.length > 0;
    const filePl   = filePlacementInput ? filePlacementInput.value.trim() : '';

    if (!text && !hasFile) { alert('Please enter text to engrave or upload a design file.'); return false; }
    if (text && !font)     { alert('Please select a font for your text.'); return false; }
    if (text && !size)     { alert('Please select a font size for your text.'); return false; }
    if (text && !loc)      { alert('Please describe where the text should be placed.'); return false; }
    if (hasFile && !filePl){ alert('Please describe where the uploaded design should be placed.'); return false; }
    return true;
  }

  function validateCustomStep2() {
    const changes = customChanges ? customChanges.value.trim() : '';
    const hasFile = uploadFileCustom && uploadFileCustom.files && uploadFileCustom.files.length > 0;
    if (!changes && !hasFile) {
      alert('Please describe your requested changes or upload a design file.');
      return false;
    }
    return true;
  }

  // ─────────────────────────────────────────
  // Step 3 summary
  // ─────────────────────────────────────────
  function populateStep3Summary() {
    const summaryEl = get('summary');
    if (summaryEl) {
      const text     = textField        ? (textField.value.trim()        || 'None') : 'None';
      const font     = selectedFont     || 'None';
      const size     = textSizeSelect   ? (textSizeSelect.value          || 'None') : 'None';
      const loc      = textLocation     ? (textLocation.value.trim()     || 'None') : 'None';
      const filePl   = filePlacementInput ? (filePlacementInput.value.trim() || 'None') : 'None';
      const fileName = (uploadFileInput && uploadFileInput.files && uploadFileInput.files[0])
                        ? uploadFileInput.files[0].name : 'None';
      const notes    = additionalNotes ? (additionalNotes.value.trim() || 'None') : 'None';
      summaryEl.innerHTML = `
        <p><strong>Product:</strong> ${escapeHtml(selectExisting ? selectExisting.value : '')}</p>
        <p><strong>Engraved Text:</strong> ${escapeHtml(text)}</p>
        <p><strong>Font:</strong> ${escapeHtml(font)}</p>
        <p><strong>Text Size:</strong> ${escapeHtml(size)}</p>
        <p><strong>Text Placement:</strong> ${escapeHtml(loc)}</p>
        <p><strong>Uploaded File:</strong> ${escapeHtml(fileName)}</p>
        <p><strong>File Placement:</strong> ${escapeHtml(filePl)}</p>
        <p><strong>Additional Notes:</strong> ${escapeHtml(notes)}</p>
        <p><strong>Price per item:</strong> $${currentPrice.toFixed(2)}</p>
      `;
    }

    const summaryCustomEl = get('summary_custom');
    if (summaryCustomEl) {
      const sel      = selectExisting    ? (selectExisting.value           || 'None') : 'None';
      const changes  = customChanges     ? (customChanges.value.trim()     || 'None') : 'None';
      const filePl   = filePlacementCustom ? (filePlacementCustom.value.trim() || 'None') : 'None';
      const fileName = (uploadFileCustom && uploadFileCustom.files && uploadFileCustom.files[0])
                        ? uploadFileCustom.files[0].name : 'None';
      summaryCustomEl.innerHTML = `
        <p><strong>Selected Product:</strong> ${escapeHtml(sel)}</p>
        <p><strong>Requested Changes:</strong> ${escapeHtml(changes)}</p>
        <p><strong>Uploaded File:</strong> ${escapeHtml(fileName)}</p>
        <p><strong>File Placement:</strong> ${escapeHtml(filePl)}</p>
        <p><strong>Price per item:</strong> $${currentPrice.toFixed(2)}</p>
      `;
    }

    // Reset qty to 1 when entering step 3
    orderQty = 1; orderQtyCustom = 1;
    if (orderQtyInput)       orderQtyInput.value       = 1;
    if (orderQtyInputCustom) orderQtyInputCustom.value = 1;
    renderTotalPrice();
  }

  // ─────────────────────────────────────────
  // Reset after cart add
  // ─────────────────────────────────────────
  function resetAllFields() {
    if (textField)           textField.value           = '';
    if (textLocation)        textLocation.value        = '';
    if (textSizeSelect)      textSizeSelect.value      = '';
    if (customChanges)       customChanges.value       = '';
    if (filePlacementInput)  filePlacementInput.value  = '';
    if (filePlacementCustom) filePlacementCustom.value = '';
    if (additionalNotes)     additionalNotes.value     = '';
    if (uploadFileInput)     uploadFileInput.value     = '';
    if (uploadFileCustom)    uploadFileCustom.value    = '';
    selectedFont = ''; orderQty = 1; orderQtyCustom = 1;
    if (orderQtyInput)       orderQtyInput.value       = 1;
    if (orderQtyInputCustom) orderQtyInputCustom.value = 1;

    ['verify-name','verify-email','verify-email-confirm',
     'verify-name-custom','verify-email-custom','verify-email-confirm-custom']
      .forEach(id => { const el = get(id); if (el) el.value = ''; });

    if (selectedProductTextFull)   selectedProductTextFull.textContent   = 'None';
    if (selectedProductTextCustom) selectedProductTextCustom.textContent = 'None';
    if (productPreviewFull)        productPreviewFull.src   = 'images/placeholder.png';
    if (productPreviewCustom)      productPreviewCustom.src = 'images/placeholder.png';

    const s1 = get('summary');        if (s1) s1.innerHTML = '';
    const s2 = get('summary_custom'); if (s2) s2.innerHTML = '';

    // Reset font dropdown display
    const selDiv = document.querySelector('.custom-select .select-selected');
    if (selDiv) { selDiv.textContent = '-- Select a Font --'; selDiv.style.fontFamily = ''; }
    if (fontSelect) fontSelect.value = '';

    populateSelectForMode();
  }

  // ─────────────────────────────────────────
  // Button listeners — Step 1
  // ─────────────────────────────────────────
  const step1Next = get('step1-next');
  if (step1Next) {
    step1Next.addEventListener('click', () => {
      if (!validateStep1()) return;
      showStep(modeCustomize && modeCustomize.checked ? 'step2_custom' : 'step2');
    });
  }

  // ─────────────────────────────────────────
  // Button listeners — Step 2 full
  // ─────────────────────────────────────────
  const step2Next = qs('#step2 .next-step');
  if (step2Next) {
    step2Next.addEventListener('click', () => {
      if (!validateFullStep2()) return;
      populateStep3Summary();
      showStep('step3');
    });
  }
  const step2Back = qs('#step2 .prev-step');
  if (step2Back) step2Back.addEventListener('click', () => showStep('step1'));

  // ─────────────────────────────────────────
  // Button listeners — Step 2 custom
  // ─────────────────────────────────────────
  const step2CustomNext = qs('#step2_custom .next-step');
  if (step2CustomNext) {
    step2CustomNext.addEventListener('click', () => {
      if (!validateCustomStep2()) return;
      populateStep3Summary();
      showStep('step3_custom');
    });
  }
  const step2CustomBack = qs('#step2_custom .prev-step');
  if (step2CustomBack) step2CustomBack.addEventListener('click', () => showStep('step1'));

  // ─────────────────────────────────────────
  // Button listeners — Step 3 backs
  // ─────────────────────────────────────────
  const step3Back = qs('#step3 .prev-step');
  if (step3Back) step3Back.addEventListener('click', () => showStep('step2'));

  const step3CustomBack = qs('#step3_custom .prev-step');
  if (step3CustomBack) step3CustomBack.addEventListener('click', () => showStep('step2_custom'));

  // ─────────────────────────────────────────
  // Quantity buttons
  // ─────────────────────────────────────────
  if (qtyApplyBtn) {
    qtyApplyBtn.addEventListener('click', () => {
      const val = parseInt(orderQtyInput ? orderQtyInput.value : '1', 10);
      if (!val || val < 1) { alert('Please enter a valid quantity (1 or more).'); return; }
      orderQty = val;
      renderTotalPrice();
    });
  }
  if (qtyResetBtn) {
    qtyResetBtn.addEventListener('click', () => {
      orderQty = 1;
      if (orderQtyInput) orderQtyInput.value = 1;
      renderTotalPrice();
    });
  }
  if (qtyApplyBtnCustom) {
    qtyApplyBtnCustom.addEventListener('click', () => {
      const val = parseInt(orderQtyInputCustom ? orderQtyInputCustom.value : '1', 10);
      if (!val || val < 1) { alert('Please enter a valid quantity (1 or more).'); return; }
      orderQtyCustom = val;
      renderTotalPrice();
    });
  }
  if (qtyResetBtnCustom) {
    qtyResetBtnCustom.addEventListener('click', () => {
      orderQtyCustom = 1;
      if (orderQtyInputCustom) orderQtyInputCustom.value = 1;
      renderTotalPrice();
    });
  }

  // ─────────────────────────────────────────
  // File delete buttons
  // ─────────────────────────────────────────
  if (deleteFileBtn)       deleteFileBtn.addEventListener('click',       () => { if (uploadFileInput)  uploadFileInput.value  = ''; });
  if (deleteFileCustomBtn) deleteFileCustomBtn.addEventListener('click', () => { if (uploadFileCustom) uploadFileCustom.value = ''; });

  // ─────────────────────────────────────────
  // Mode toggle & product select
  // ─────────────────────────────────────────
  if (modeCustomize)  modeCustomize.addEventListener('change',  populateSelectForMode);
  if (modeFull)       modeFull.addEventListener('change',       populateSelectForMode);
  if (selectExisting) selectExisting.addEventListener('change', updateSelectedProductDisplay);

  // ─────────────────────────────────────────
  // Add to Cart — full flow
  // ─────────────────────────────────────────
  const addToCartFullBtn = get('add-to-cart-full');
  if (addToCartFullBtn) {
    addToCartFullBtn.addEventListener('click', () => {
      const name         = get('verify-name')          ? get('verify-name').value.trim()          : '';
      const email        = get('verify-email')         ? get('verify-email').value.trim()         : '';
      const emailConfirm = get('verify-email-confirm') ? get('verify-email-confirm').value.trim() : '';

      if (!name || !email)        { alert('Please enter your name and email.'); return; }
      if (email !== emailConfirm) { alert('Emails do not match.'); return; }
      if (!validateFullStep2())   return;

      const qty         = orderQty;
      const totalCost   = (currentPrice * qty).toFixed(2);
      const textSize    = textSizeSelect ? textSizeSelect.value : 'None';
      const productName = selectExisting ? selectExisting.value : 'Custom Product';
      const fileName    = (uploadFileInput && uploadFileInput.files && uploadFileInput.files[0])
                          ? uploadFileInput.files[0].name : 'None';
      const desc = [
        `Text: ${textField ? textField.value || 'None' : 'None'}`,
        `Font: ${selectedFont || 'None'}`,
        `Size: ${textSize || 'None'}`,
        `Placement: ${textLocation ? textLocation.value || 'None' : 'None'}`,
        `File: ${fileName}`,
        `File Placement: ${filePlacementInput ? filePlacementInput.value || 'None' : 'None'}`,
        `Quantity: ${qty} order${qty > 1 ? 's' : ''}`,
      ].join(', ');

      if (window.addToCart) window.addToCart(`${productName} — ${desc}`, parseFloat(totalCost));

      if (hiddenFlowType)      hiddenFlowType.value      = 'create-your-own';
      if (hiddenProduct)       hiddenProduct.value       = productName;
      if (hiddenText)          hiddenText.value          = textField ? textField.value : '';
      if (hiddenFont)          hiddenFont.value          = selectedFont;
      if (hiddenTextSize)      hiddenTextSize.value      = textSize;
      if (hiddenLocation)      hiddenLocation.value      = textLocation ? textLocation.value : '';
      if (hiddenFilePlacement) hiddenFilePlacement.value = filePlacementInput ? filePlacementInput.value : '';
      if (hiddenAdditionalNotes) hiddenAdditionalNotes.value = additionalNotes ? additionalNotes.value : '';
      if (hiddenPrice)         hiddenPrice.value         = `$${totalCost} (${qty} x $${currentPrice.toFixed(2)})`;
      if (hiddenEmail)         hiddenEmail.value         = email;
      if (hiddenName)          hiddenName.value          = name;
      if (hiddenQuantity)      hiddenQuantity.value      = qty;
      copyFileIntoHiddenInput(uploadFileInput);
      if (sendForm) sendForm.submit();

      alert('Your custom product has been added to the Cart! If you proceed with your order, an email with a sample design of your customization will be sent to you within 1 business day. YOU MUST RESPOND within 3 business days or your order will be automatically refunded!');
      resetAllFields();
      showStep('step1');
    });
  }

  // ─────────────────────────────────────────
  // Add to Cart — customize flow
  // ─────────────────────────────────────────
  const addToCartCustomBtn = get('add-to-cart-custom');
  if (addToCartCustomBtn) {
    addToCartCustomBtn.addEventListener('click', () => {
      const name         = get('verify-name-custom')          ? get('verify-name-custom').value.trim()          : '';
      const email        = get('verify-email-custom')         ? get('verify-email-custom').value.trim()         : '';
      const emailConfirm = get('verify-email-confirm-custom') ? get('verify-email-confirm-custom').value.trim() : '';

      if (!name || !email)        { alert('Please enter your name and email.'); return; }
      if (email !== emailConfirm) { alert('Emails do not match.'); return; }
      if (!validateCustomStep2()) return;

      const qty         = orderQtyCustom;
      const totalCost   = (currentPrice * qty).toFixed(2);
      const productName = selectExisting ? selectExisting.value : 'Custom Product';
      const fileName    = (uploadFileCustom && uploadFileCustom.files && uploadFileCustom.files[0])
                          ? uploadFileCustom.files[0].name : 'None';
      const desc = [
        `Changes: ${customChanges ? customChanges.value || 'None' : 'None'}`,
        `File: ${fileName}`,
        `File Placement: ${filePlacementCustom ? filePlacementCustom.value || 'None' : 'None'}`,
        `Quantity: ${qty} order${qty > 1 ? 's' : ''}`,
      ].join(', ');

      if (window.addToCart) window.addToCart(`${productName} — ${desc}`, parseFloat(totalCost));

      if (hiddenFlowType)             hiddenFlowType.value             = 'customize';
      if (hiddenSelectedProduct)      hiddenSelectedProduct.value      = productName;
      if (hiddenCustomChanges)        hiddenCustomChanges.value        = customChanges ? customChanges.value : '';
      if (hiddenCustomFilePlacement)  hiddenCustomFilePlacement.value  = filePlacementCustom ? filePlacementCustom.value : '';
      if (hiddenPrice)                hiddenPrice.value                = `$${totalCost} (${qty} x $${currentPrice.toFixed(2)})`;
      if (hiddenEmail)                hiddenEmail.value                = email;
      if (hiddenName)                 hiddenName.value                 = name;
      if (hiddenQuantity)             hiddenQuantity.value             = qty;
      copyFileIntoHiddenInput(uploadFileCustom);
      if (sendForm) sendForm.submit();

      alert('Your customization has been added to the Cart! If you proceed with your order, an email with a sample design of your customization will be sent to you within 1 business day. YOU MUST RESPOND within 3 business days or your order will be automatically refunded!');
      resetAllFields();
      showStep('step1');
    });
  }

  // ─────────────────────────────────────────
  // Custom font dropdown
  // ─────────────────────────────────────────
  function createFontDropdown() {
    if (!fontSelect) return;

    const container = document.createElement('div');
    container.classList.add('custom-select');
    fontSelect.style.display = 'none';

    const selectedDiv = document.createElement('div');
    selectedDiv.classList.add('select-selected');
    selectedDiv.textContent = '-- Select a Font --';
    container.appendChild(selectedDiv);

    const optionsDiv = document.createElement('div');
    optionsDiv.classList.add('select-items', 'select-hide');

    for (let i = 0; i < fontSelect.options.length; i++) {
      const opt = fontSelect.options[i];
      const div = document.createElement('div');
      div.textContent = opt.text;
      div.style.fontFamily = opt.value
        ? (opt.value.includes(' ') ? `'${opt.value}'` : opt.value)
        : '';
      if (!opt.value) div.style.color = '#999';

      div.addEventListener('click', () => {
        fontSelect.selectedIndex     = i;
        fontSelect.value             = opt.value;
        selectedDiv.textContent      = opt.text;
        selectedDiv.style.fontFamily = opt.value ? div.style.fontFamily : '';
        selectedFont                 = opt.value ? opt.text : '';
        closeAllSelect();
      });
      optionsDiv.appendChild(div);
    }

    container.appendChild(optionsDiv);
    fontSelect.parentNode.insertBefore(container, fontSelect.nextSibling);

    selectedDiv.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = optionsDiv.classList.contains('select-hide');
      closeAllSelect();
      if (isHidden) {
        optionsDiv.classList.remove('select-hide');
        selectedDiv.classList.add('select-arrow-active');
      }
    });

    function closeAllSelect() {
      document.querySelectorAll('.select-items').forEach(el => el.classList.add('select-hide'));
      document.querySelectorAll('.select-selected').forEach(el => el.classList.remove('select-arrow-active'));
    }
    document.addEventListener('click', closeAllSelect);
  }
  createFontDropdown();

  // ─────────────────────────────────────────
  // URL bootstrap
  // ─────────────────────────────────────────
  function bootstrapFromURL() {
    const params  = new URLSearchParams(window.location.search);
    const mode    = params.get('mode');
    const product = params.get('product');
    const step    = params.get('step');

    if (mode === 'full') {
      if (modeFull)      modeFull.checked      = true;
      if (modeCustomize) modeCustomize.checked = false;
    } else {
      if (modeCustomize) modeCustomize.checked = true;
      if (modeFull)      modeFull.checked      = false;
    }

    populateSelectForMode();

    if (product && selectExisting) {
      selectExisting.value = product;
      updateSelectedProductDisplay();
    }

    if (step === '2') {
      showStep(mode === 'full' ? 'step2' : 'step2_custom');
    } else {
      showStep('step1');
    }
  }

  bootstrapFromURL();
});