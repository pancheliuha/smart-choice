import $ from "jquery";

export const slider = () => {
  if ($('#slider-page').length && window.innerWidth > 767) {
    $('html, body').on('wheel', handleMouseWheel);
    $('.main-arrow-anchor').on('click', scrollToSLiderScreen);
    $('[data-href]').on('click', switchStepsLink);
    let locked = false;

    const hashSteps = {
      companyEmployees: 'company-employees',
      companyPartners: 'company-partners',
      companyStrategy: 'company-strategy',
      properlyChosenInstruments: 'properly-chosen-instruments',
      happyConsumer: 'happy-consumer',
      contacts: 'contacts',
    };

    const hashStepsOrders = [
      'companyEmployees',
      'companyPartners',
      'companyStrategy',
      'properlyChosenInstruments',
      'happyConsumer',
      'contacts',
    ];

    const hashStepsNames = [
      'company-employees',
      'company-partners',
      'company-strategy',
      'properly-chosen-instruments',
      'happy-consumer',
      'contacts'
    ]

    function screenNumByHash(checkHashValue) {
      let screenNumber;

      hashStepsOrders.forEach((value) => {
        switch (checkHashValue) {
          case 'companyEmployees':
          case 'companyPartners':
          case 'companyStrategy':
          case 'properlyChosenInstruments':
          case 'happyConsumer':

          case 'company-employees':
          case 'company-partners':
          case 'company-strategy':
          case 'properly-chosen-instruments':
          case 'happy-consumer':

            screenNumber = 2;
            break;

          case 'contacts':
            screenNumber = 3;
            break;
          default:
            screenNumber = 1;
            break;
        }
      })

      return screenNumber;
    }

    function handleMouseWheel(e) {
      if (e.originalEvent.wheelDelta > 0 || e.originalEvent.deltaY < 0) {
        // Scroll up
        scrollUpHandle();
      }
      else {
        // Scroll down
        scrollDownHandle();
      }
    }

    function scrollUpHandle() {
      const isMenuOpened = $('.menu').hasClass('opened');
      const allContentBlock = $('.main-content');
      const currentScreenNumber = +allContentBlock.attr('data-screen');
      const currentHashStep = getCurrentHashName();

      if (isMenuOpened || currentScreenNumber === 1 || locked) {
        return;
      }

      if (currentScreenNumber === 3) {
        changeScreen(2)
      }

      if (currentHashStep === undefined || currentHashStep.length === 0) {
        setHashName(hashStepsNames[0]);
      } else {
        const currentHashPosition = hashStepsNames.indexOf(currentHashStep)

        if (currentHashPosition !== -1) {
          const prevSlideHash = hashStepsNames[currentHashPosition - 1] || ''
          setHashName(prevSlideHash);
          changeScreen();
        }
      }

      setActiveLink()
      switchSlide();
      lockScroll();
      toggleMiniLogoVisibility();
    }

    function scrollDownHandle() {
      const isMenuOpened = $('.menu').hasClass('opened');
      const allContentBlock = $('.main-content');
      const currentScreenNumber = +allContentBlock.attr('data-screen');
      const currentHashStep = getCurrentHashName();

      if (isMenuOpened || currentScreenNumber === 3 || locked) {
        return;
      }

      if (currentScreenNumber === 1) {
        changeScreen(2)
      }

      if (currentHashStep === undefined || currentHashStep.length === 0 || !checkValidHashName(currentHashStep)) {
        setHashName(hashStepsNames[0]);
      } else {
        const currentHashPosition = hashStepsNames.indexOf(currentHashStep)

        if (currentHashPosition !== -1) {
          const nextSlideHash = hashStepsNames[currentHashPosition + 1] || 'contacts'
          setHashName(nextSlideHash);
          changeScreen();
        }
      }

      setActiveLink()
      switchSlide();
      lockScroll();
      toggleMiniLogoVisibility();
    }

    function scrollToSLiderScreen(e) {
      e.preventDefault();
      const allContentBlock = $('.main-content');
      allContentBlock.addClass('scrolled-slider');
    }

    function switchStepsLink(e) {
      e.preventDefault();
      const switchHashKey = e.currentTarget.dataset.href;
      const screenNumber = screenNumByHash(switchHashKey);
      setHashName(hashSteps[switchHashKey]);
      changeScreen(screenNumber);
      switchSlide(hashSteps[switchHashKey]);
      setActiveLink();
      toggleMiniLogoVisibility();
    }

    function changeScreen(screenNumber) {
      const currentHashStep = getCurrentHashName();
      const screenNumberByHash = screenNumByHash(currentHashStep);
      const screenNum = screenNumber || screenNumberByHash;
      const allContentBlock = $('.main-content');
      allContentBlock.attr('data-screen', screenNum);
    }

    function switchSlide(slideHashKey) {
      const currentHashStep = slideHashKey || getCurrentHashName();

      if (currentHashStep === 'contacts') {
        return
      }

      if (hashStepsNames.indexOf(currentHashStep) !== -1) {
        const indexOfSlide = hashStepsNames.indexOf(currentHashStep)
        const shouldHideSlidesArr = hashStepsNames.slice(0, indexOfSlide);

        $('.slide.hidden').removeClass('hidden')

        for (let i = 0; i < shouldHideSlidesArr.length; i++) {
          const hideSlideElemKey = shouldHideSlidesArr[i];
          $(`[data-slide="${hideSlideElemKey}"]`).addClass("hidden");
        }
      }
    }

    function setActiveLink() {
      const currentHashStep = getCurrentHashName();

      $('.menu-link').removeClass('active');
      $(`.menu-link[href="#${currentHashStep}"]`).addClass("active");
    }

    function getCurrentHashName() {
      return location.hash.slice(1)
    }

    function setHashName(hashName) {
      location.hash = `#${hashName}`
    }

    function checkValidHashName(hash) {
      return hashStepsNames.indexOf(hash) !== -1
    }

    function lockScroll() {
      locked = true
      setTimeout(() => {
        locked = false;
      }, 1200)
    }

    function toggleMiniLogoVisibility() {
      const allContentBlock = $('.main-content');
      const miniLogo = $('.mini-logo');
      const currentScreenNumber = +allContentBlock.attr('data-screen');

      if (currentScreenNumber !== 1) {
        miniLogo.addClass("visible");
      } else {
        miniLogo.removeClass("visible");
      }
    }


    changeScreen();
    switchSlide();
    setActiveLink();
    toggleMiniLogoVisibility();

    //touch
    let touchstartX = 0;
    let touchstartY = 0;
    let touchendX = 0;
    let touchendY = 0;

    const gesuredZone = document.querySelector('html');

    gesuredZone.addEventListener('touchstart', function(event) {
      touchstartX = event.changedTouches[0].screenX;
      touchstartY = event.changedTouches[0].screenY;
    }, false);

    gesuredZone.addEventListener('touchend', function(event) {
      touchendX = event.changedTouches[0].screenX;
      touchendY = event.changedTouches[0].screenY;
      handleGesure();
    }, false);

    function handleGesure() {
      let swiped = 'swiped: ';
      if (touchendX < touchstartX) {
        console.log(swiped + 'left!');
      }
      if (touchendX > touchstartX) {
        console.log(swiped + 'right!');
      }
      if (touchendY < touchstartY) {
        console.log(swiped + 'down!');
        scrollDownHandle()
      }
      if (touchendY > touchstartY) {
        console.log(swiped + 'up!');
        scrollUpHandle()
      }
      if (touchendY == touchstartY) {
        console.log('tap!');
      }
    }

  }

  if (window.innerWidth <= 767) {
    //mobile

    $('.menu-link').on('click', anchorsMenuHandle)
    $('.main-arrow-anchor').on('click', anchorsArrowHandle)
    $(document).on('scroll', setActiveLinkByScroll)


    function anchorsMenuHandle(e) {
      e.preventDefault();

      const anchorTargetDataKey = e.currentTarget.hash.slice(1);
      const anchorTargetElement = $(`[data-anchor="${anchorTargetDataKey}"]`);

      $("html, body").delay(200).animate({scrollTop: anchorTargetElement.offset().top }, 500);
    }

    function anchorsArrowHandle() {
      const anchorTargetElement = $(`[data-anchor="company-employees"]`);
      $("html, body").animate({scrollTop: anchorTargetElement.offset().top }, 500);
    }

    function anchorsLoadhandle() {
      const anchorTargetDataKey = getCurrentHashName();

      if (!anchorTargetDataKey.length || anchorTargetDataKey === undefined) {
        return
      }

      const anchorTargetElement = $(`[data-anchor="${anchorTargetDataKey}"]`);
      if (anchorTargetElement.length) {
        $("html, body").animate({scrollTop: anchorTargetElement.offset().top }, 500);
      }
    }


    function setActiveLinkByScroll(e) {
      let scrollPos = $(document).scrollTop();
      $('.menu-link').each(function () {
        const currLink = $(this);
        const currHref = currLink.attr("href").slice(1)
        console.log(currHref);

        const refElement = $(`[data-anchor="${currHref}"]`);
        if (refElement.position().top + 200  <= scrollPos && refElement.position().top + refElement.height() + 200 > scrollPos) {
          $('.menu-link').removeClass("active");
          currLink.addClass("active");
        }
        else{
          currLink.removeClass("active");
        }
      });
    }

    function getCurrentHashName() {
      return location.hash.slice(1)
    }

    function setHashName(hashName) {
      location.hash = `#${hashName}`
    }

    anchorsLoadhandle();
  }

}