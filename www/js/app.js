angular.module('starter', ['ionic','starter.user', 'starter.controllers', 'starter.services','ngCordova','ion-gallery','jett.ionic.filter.bar', 'ion-gallery', 'jett.ionic.scroll.sista','ion-affix'])

.run(function($rootScope, $state, $ionicPlatform, User,$cordovaNetwork,$ionicPopup) {
  $rootScope.RememberUN = localStorage['userName'];
  $rootScope.RememberPW = localStorage['passWord'];

  $rootScope.$on('$stateChangeStart', function(event, toState) {

     if (!User.isLoggedIn() && toState.name !== 'login') {
        event.preventDefault();
        $state.go('login');
      }

  });

  if(window.Connection){
    if(navigator.connection.type== Connection.NONE)
    {
      $ionicPopup.alert({
        title:'Bağlantı Hatası!',
        template:'İnternet bağlantınızda bir problem var.'
      })
        .then(function (response) {
          $state.go('login');
        })
    }
  }


  $ionicPlatform.ready(function() {
    var notificationOpenedCallback = function() {
      if(User.isLoggedIn()) {
      $state.go('products');
      }
    };

    window.plugins.OneSignal.init("d4f9c8e6-e347-4ef8-af70-944cfd6ea9de",
      {googleProjectNumber: "94724881690"},
      notificationOpenedCallback);

    // Show an alert box if a notification comes in when the user is in your app.
    window.plugins.OneSignal.enableInAppAlertNotification(true);
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });
  $rootScope.isAdmin = function() {
    if($rootScope.role === 'Administrators,Forum Moderators,Registered')
    {
      return true;
    }
    else
    {
      return false
    }
  };

  $rootScope.Destroy = function () {
    localStorage['apiToken']='';
    User.token = '';
  };
})

.filter('htmlToPlaintext', function() {
  return function(text) {
    return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
  };
})

.config(function($stateProvider, $urlRouterProvider,$compileProvider,$httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.headers.common = 'Content-Type: application/x-www-form-urlencoded';

  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // Home screen
  .state('home', {
    url: '/home',
    templateUrl: 'templates/home.html',
    controller: 'HomeCtrl'
  })

  //Products
  .state('products', {
    url: '/products',
    templateUrl: 'templates/products.html',
    controller: 'ProductsCtrl'
  })

  // View category
  .state('category', {
    url: '/category/:id',
    templateUrl: 'templates/category.html',
    controller: 'CategoryCtrl'
  })

  .state('katalog', {
    url:'/katalog',
    templateUrl:'templates/katalog.html',
    controller: 'KatalogCtrl'
  })

  .state('katalogdetay',{
    url:'/katalog/:id',
    templateUrl: 'templates/katalogdetay.html',
    controller: 'KatalogDetayCtrl'
  })

  // Product detail
  .state('detail', {
    url: '/detail/:id',
    templateUrl: 'templates/detail.html',
    controller: 'DetailCtrl'
  })

  // Checkout
  .state('checkout', {
    url: '/checkout',
    templateUrl: 'templates/checkout.html',
    controller: 'CheckoutCtrl'
  })

  // Shipping
  .state('shipping', {
    url: '/shipping',
    templateUrl: 'templates/shipping.html',
    controller: 'CheckoutCtrl'
  })

// Payment
  .state('payment', {
    url: '/payment',
    templateUrl: 'templates/payment.html',
    controller: 'CheckoutCtrl'
  })
  // Firma
    .state('firma', {
      url: '/firma',
      templateUrl: 'templates/firma.html',
      controller: 'FirmaCtrl'
    })

  // Cart detail
  .state('cart', {
    url: '/cart',
    templateUrl: 'templates/cart.html',
    controller: 'CartCtrl'
  })

  // Account
  .state('account', {
    url: '/account',
    templateUrl: 'templates/account.html',
    controller: 'AccCtrl'
  })

  // Latests
  .state('latests', {
    url: '/latests',
    templateUrl: 'templates/latests.html',
    controller: 'LatestsCtrl'
  })

  // Orders
  .state('orders', {
    url: '/orders',
    templateUrl: 'templates/orders.html',
    controller: 'OrdersCtrl'
  })


//------------------------------------------------------------------------------------------------------------------------------------------------------
    // Admin States
    .state('adminhome',{
      url: '/adminhome',
      templateUrl: 'admin/adminhome.html',
      controller: 'aHomeCtrl'
    })

    .state('adminProducts',{
      url:'/adminProducts',
      templateUrl: 'admin/products.html',
      controller: 'aProductsCtrl'
    })

    .state('addProduct', {
      url:'/addProduct',
      templateUrl:'admin/addProduct.html',
      controller: 'addProductCtrl'
    })

//------------------------------------------------------------------------------------------------------------------------------------------------------
  // login screen
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  // register screen
  .state('register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'AuthCtrl'
  });
  $urlRouterProvider.otherwise('/login');


  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|content|file|assets-library):/);

})
