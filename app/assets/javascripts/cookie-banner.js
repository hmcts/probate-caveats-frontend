(function () {
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initialiseCookieBanner();
        });
    } else {
        initialiseCookieBanner();
    }

    function initialiseCookieBanner() {
        
        /*  This callback is called when the 'accept' action is fired within the cookie banner
        *   This is where you'd hide the first stage in a decision/confirmation style banner
        */
        const cookieBannerAccept = function () {
            document.querySelector('.cm-cookie-banner__decision').hidden = true;
            document.querySelector('.cm-cookie-banner__confirmation').hidden = false;
        }

        /*  This callback is called when the 'reject' action is fired within the cookie banner
        *   This is where you'd hide the first stage in a decision/confirmation style banner
        */
        const cookieBannerReject = function () {
            document.querySelector('.cm-cookie-banner__decision').hidden = true;
            document.querySelector('.cm-cookie-banner__confirmation').hidden = false;
        }


        /*  This is where you'd perform logic regarding granting or denying the injection
        *   of cookies, scripts and tags that required consent. This callback is called
        *   with an object containing the current cookie preferences.
        */
        const cookiePreferencesUpdated = function (cookieStatus) {
            // GTM based GA consent
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({'event': 'Cookie Preferences', 'cookiePreferences': cookieStatus});
            
            // Dynatrace RUM Consent
            const dtrum = window.dtrum;
            if (dtrum) {
                if (cookieStatus.apm === 'on') {
                    dtrum.enable();
                    dtrum.enableSessionReplay();
                } else {
                    dtrum.disableSessionReplay();
                    dtrum.disable();
                }    
            }
        }

        /*  This is where you configure the initial settings of the cookieManager and list the cookies that you
        *   expect to appear on the site, and their subsequent categories and optionality.
        */
        console.info (`sec: ${document.getElementById('hdnSecurityCookie').value}`);

        /*  Initializes the cookie manager with the provided settings */
        cookieManager.init({
            'user-preference-cookie-name': 'cm-user-preferences',
            'user-preference-saved-callback': cookiePreferencesUpdated,
            'preference-form-id': 'cookie-manager-form',
            'set-checkboxes-in-preference-form': true,
            'cookie-banner-id': 'cm-cookie-banner',
            'cookie-banner-visible-on-page-with-preference-form': true,
            'cookie-banner-reject-callback': cookieBannerReject,
            'cookie-banner-accept-callback': cookieBannerAccept,
            'cookie-banner-auto-hide': false,
            'cookie-manifest': [
              {
                'category-name': 'essential',
                'optional': false,
                'cookies': [
                    "cm-user-preferences",
                    "connect.sid",
                    document.getElementById('hdnSecurityCookie').value,
                    "__eligibility"
                ]
              },
              {
                'category-name': 'analytics',
                'optional': true,
                'cookies': [
                  '_ga',
                  '_gid',
                  '_gat'
                ]
              },
              {
                'category-name': 'apm',
                'optional': true,
                'cookies': [
                  'dtCookie',
                  'dtLatC',
                  'dtPC',
                  'dtSa',
                  'rxVisitor',
                  'rxvt'
                ]
              }
            ]
          });
    }    
})();







