document.addEventListener("DOMContentLoaded", () => {
  
  /* ================= MOBILE NAV LOGIC (FIXED) ================= */
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", (e) => {
      // Toggle class for CSS display block
      mainNav.classList.toggle("active");
      e.stopPropagation();
    });

    // Close menu if clicking outside
    document.addEventListener("click", (e) => {
      if (mainNav.classList.contains("active") && 
          !mainNav.contains(e.target) && 
          !navToggle.contains(e.target)) {
        mainNav.classList.remove("active");
      }
    });

    // Close menu when clicking a link
    mainNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("active");
      });
    });
  }

  /* ================= WIZARD LOGIC ================= */
  const wizardForm = document.getElementById("wizardForm");
  
  // Only run if wizard exists on page
  if (wizardForm) {
      const steps = document.querySelectorAll(".wizard-step");
      const nextBtns = document.querySelectorAll(".btn-next");
      const prevBtns = document.querySelectorAll(".btn-prev");
      const progressBar = document.getElementById("progressBar");
      const currStepNum = document.getElementById("currStepNum");
      const btnCalculate = document.getElementById("btnCalculate");
      const resultBtn = document.getElementById("resultBtn");
      const sidebar = document.getElementById("wizardSidebar");
      
      let currentStep = 1;
      const totalSteps = 5;

      const standardSidebarHTML = `
        <div class="live-score-box">
          <span class="score-label">Your Points</span>
          <span class="score-val" id="liveScore">0</span>
          <span class="score-req">/ 6 Required</span>
        </div>
        <ul class="score-breakdown">
          <li>Language: <span id="scoreLang">0</span></li>
          <li>Age: <span id="scoreAge">0</span></li>
          <li>Experience: <span id="scoreExp">0</span></li>
          <li>Bonus: <span id="scoreBonus">0</span></li>
        </ul>
        <button type="button" class="btn btn-ghost" id="resetBtn" style="width:100%; margin-top:20px; font-size: 0.8rem; opacity: 0.7;">
           ↺ Reset Options
        </button>
      `;

      function attachResetListener() {
        const btn = document.getElementById("resetBtn");
        if(btn) btn.addEventListener("click", resetWizard);
      }

      function updateWizard() {
        steps.forEach(step => {
          step.classList.remove("active");
          if(parseInt(step.dataset.step) === currentStep) {
            step.classList.add("active");
          }
        });
        const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
        if(progressBar) progressBar.style.width = `${progress}%`;
        if(currStepNum && currentStep < 5) currStepNum.textContent = currentStep;
        
        validateStep();
      }

      function resetWizard() {
        const inputs = ["nationality", "recognition", "german", "english", "experience"];
        inputs.forEach(id => {
            const el = document.getElementById(id);
            if(el) el.value = "";
        });
        
        document.querySelectorAll('input[name="hasDegree"]').forEach(r => r.checked = false);
        document.querySelectorAll('input[name="age"]').forEach(r => r.checked = false); 
        
        ["residence", "shortage", "spouse"].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.checked = false;
        });

        currentStep = 1;
        updateWizard();
        updateLiveScore();
      }

      function validateStep() {
        const activeStep = document.querySelector(`.wizard-step[data-step="${currentStep}"]`);
        if(!activeStep) return;
        const nextBtn = activeStep.querySelector('.btn-next');
        if(!nextBtn) return; 

        if(currentStep === 1) {
            const nat = document.getElementById("nationality").value;
            const degRadio = document.querySelector('input[name="hasDegree"]:checked');
            const recog = document.getElementById("recognition").value;
            const hasDegree = degRadio ? degRadio.value : null;

            // Block invalid paths immediately
            if (nat === "eu" || hasDegree === "no" || recog === "full") {
                nextBtn.disabled = true;
                nextBtn.style.display = 'none'; 
                return;
            } else {
                nextBtn.style.display = 'inline-flex';
            }

            let isValid = true;
            if (nat === "") isValid = false;
            if (nat === "non-eu" && !hasDegree) isValid = false;
            if (hasDegree === "yes" && recog === "") isValid = false;

            nextBtn.disabled = !isValid;
        } 
        else if(currentStep === 2) {
           const ger = document.getElementById("german").value;
           const eng = document.getElementById("english").value;
           nextBtn.disabled = !(ger !== "" && eng !== "");
        }
        else if(currentStep === 3) {
           const ageRadio = document.querySelector('input[name="age"]:checked');
           const exp = document.getElementById("experience").value;
           nextBtn.disabled = !(ageRadio && exp !== "");
        }
      }

      function updateLiveScore() {
        const nat = document.getElementById("nationality").value;
        const degRadio = document.querySelector('input[name="hasDegree"]:checked');
        const hasDegree = degRadio ? degRadio.value : null;
        const recog = document.getElementById("recognition").value;

        const grpDegree = document.getElementById("grp-degree");
        const grpRecog = document.getElementById("grp-recognition");
        
        if (nat === "non-eu") {
            grpDegree.style.display = "block";
        } else {
            grpDegree.style.display = "none";
            grpRecog.style.display = "none";
        }

        if (grpDegree.style.display === "block") {
            grpRecog.style.display = (hasDegree === "yes") ? "block" : "none";
        }

        // EU Citizen
        if (nat === "eu") {
          sidebar.innerHTML = `
            <div style="text-align: center;">
              <div style="font-size: 3rem; margin-bottom: 10px;">🇪🇺</div>
              <h3 style="color:white; margin-bottom: 10px; font-size: 1.2rem;">No Card Needed</h3>
              <p style="color: rgba(255,255,255,0.8); font-size: 0.9rem; margin-bottom: 20px;">
                EU/EEA/Swiss citizens don't need a visa to work in Germany!
              </p>
              <a href="https://deintalents.com/contact" target="_blank" class="btn btn-primary" style="width:100%; font-size: 0.85rem;">Explore Opportunities</a>
               <button type="button" class="btn btn-ghost" id="resetBtn" style="width:100%; margin-top:20px; font-size: 0.8rem; opacity: 0.7;">↺ Reset Options</button>
            </div>
          `;
          attachResetListener();
          validateStep();
          return; 
        }

        // No Degree
        if (hasDegree === "no") {
          sidebar.innerHTML = `
            <div style="text-align: center;">
               <div style="font-size: 3rem; margin-bottom: 10px;">🎓</div>
               <h3 style="color:white; margin-bottom: 10px; font-size: 1.2rem;">Not Eligible</h3>
               <p style="color: rgba(255,255,255,0.8); font-size: 0.9rem; margin-bottom: 20px;">
                 A recognized degree or 2-year vocational training is required.
               </p>
               <button type="button" class="btn btn-ghost" id="resetBtn" style="width:100%; margin-top:20px; font-size: 0.8rem; opacity: 0.7;">↺ Reset Options</button>
            </div>
          `;
          attachResetListener();
          validateStep();
          return; 
        }

        // Full Recognition
        if (recog === "full") {
          sidebar.innerHTML = `
            <div style="text-align: center;">
               <div style="font-size: 3rem; margin-bottom: 10px;">✅</div>
               <h3 style="color:white; margin-bottom: 10px; font-size: 1.2rem;">Directly Eligible!</h3>
               <p style="color: rgba(255,255,255,0.8); font-size: 0.9rem; margin-bottom: 20px;">
                 Your qualification is fully recognized. You skip the points system!
               </p>
               <a href="https://deintalents.com/contact" target="_blank" class="btn btn-primary" style="width:100%; font-size: 0.85rem;">Apply Now</a>
               <button type="button" class="btn btn-ghost" id="resetBtn" style="width:100%; margin-top:20px; font-size: 0.8rem; opacity: 0.7;">↺ Reset Options</button>
            </div>
          `;
          attachResetListener();
          validateStep();
          return;
        }

        // Restore Standard Sidebar if needed
        if (!document.getElementById("liveScore")) {
          sidebar.innerHTML = standardSidebarHTML;
          attachResetListener();
        }

        // --- SCORING LOGIC ---
        let score = 0;
        let sLang = 0, sAge = 0, sExp = 0, sBonus = 0;

        if (recog === "partial") score += 4;

        const deVal = document.getElementById("german").value;
        const enVal = document.getElementById("english").value;
        sLang = (deVal ? parseInt(deVal) : 0) + (enVal ? parseInt(enVal) : 0);
        score += sLang;

        const ageEl = document.querySelector('input[name="age"]:checked');
        if(ageEl) sAge = parseInt(ageEl.value);
        score += sAge;

        const expVal = document.getElementById("experience").value;
        sExp = expVal ? parseInt(expVal) : 0;
        score += sExp;

        if (document.getElementById("residence").checked) sBonus += 1;
        if (document.getElementById("shortage").checked) sBonus += 1;
        if (document.getElementById("spouse").checked) sBonus += 1;
        score += sBonus;

        const liveScoreEl = document.getElementById("liveScore");
        if(liveScoreEl) {
            liveScoreEl.innerText = score;
            document.getElementById("scoreLang").innerText = sLang;
            document.getElementById("scoreAge").innerText = sAge;
            document.getElementById("scoreExp").innerText = sExp;
            document.getElementById("scoreBonus").innerText = sBonus;
        }
        
        validateStep();
      }

      // Add Listeners
      const allInputs = wizardForm.querySelectorAll("input, select");
      allInputs.forEach(input => {
        input.addEventListener("change", updateLiveScore);
      });
      
      attachResetListener(); 
      updateLiveScore(); 

      nextBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          if(!btn.disabled && currentStep < totalSteps) {
            currentStep++;
            updateWizard();
          }
        });
      });

      prevBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          if (currentStep > 1) {
            currentStep--;
            updateWizard();
          }
        });
      });

      btnCalculate.addEventListener("click", () => {
        updateLiveScore(); 
        const liveScoreEl = document.getElementById("liveScore");
        
        if(liveScoreEl) {
            const finalScore = parseInt(liveScoreEl.innerText);
            
            resultBtn.textContent = "Start Official Application";
            resultBtn.href = "https://deintalents.com/contact"; 

            if (finalScore >= 6) {
              showResult(finalScore, "Congratulations! You meet the 6-point requirement.", "#0b9952");
            } else {
              showResult(finalScore, `You need 6 points. You currently have ${finalScore}.`, "#f47a00");
            }
            currentStep = 5;
            updateWizard();
        }
      });

      function showResult(title, desc, color) {
        const titleEl = document.getElementById("resultTitle");
        const descEl = document.getElementById("resultDesc");
        const scoreCircle = document.querySelector(".score-circle");
        const finalScoreEl = document.getElementById("finalScore");

        if(titleEl) titleEl.innerText = (typeof title === 'number') ? "Points Scored" : title;
        if(descEl) descEl.innerText = desc;
        
        if(scoreCircle) {
            if(typeof title !== 'number') {
               scoreCircle.style.display = "none"; 
            } else {
               scoreCircle.style.display = "flex";
               if(finalScoreEl) finalScoreEl.innerText = title;
               scoreCircle.style.backgroundColor = color;
            }
        }
      }
  } 

  /* ================= FAQ TOGGLE ================= */
  document.querySelectorAll(".faq-question").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      item.classList.toggle("active");
    });
  });
  
  /* ================= JOB MODAL LOGIC ================= */
  const modal = document.getElementById("applicationModal");
  if(modal) {
      const openBtns = document.querySelectorAll(".open-job-modal");
      openBtns.forEach(btn => {
          btn.addEventListener("click", () => {
              modal.classList.add("active");
          });
      });

      const closeBtn = document.querySelector(".modal-close");
      if(closeBtn) {
          closeBtn.addEventListener("click", () => {
              modal.classList.remove("active");
          });
      }

      modal.addEventListener("click", (e) => {
          if (e.target === modal) {
              modal.classList.remove("active");
          }
      });
  }

});
