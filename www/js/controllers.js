/**
 * @author: Enes Malik Sayan
 * @email: enesmaliksayan13@gmail.com
 */
angular.module('starter.controllers', ['ionic','ui.router'])


.controller('MenuCtrl', function($scope, $stateParams, $http , $state, $ionicHistory,$rootScope) {
    // Use ui-router's state to specify the active menu item
    var CATEGORY_STATE = 'category';

    $http.get('http://api.inobil.com/v1/Categories').then(function (response) {
      $scope.categories=response.data;
    });


    $scope.get=function(catId) {
      for (var i = 0; i < categories.length; i++) {
        if (categories[i].id === parseInt(catId)) {
          return categories[i];
        }
      }
      return null;
    };



    $scope.checkLink = function(cat) {

      console.log(cat);

      if (angular.isUndefined(cat.children) ||cat.children == null ) {
        $ionicHistory.nextViewOptions({
          disableBack: true
        });

        $rootScope._CatId=cat.id;
        $state.go(CATEGORY_STATE, {id: $rootScope._CatId});
        //$scope.toggleLeft();
      }
    };


    $scope.isActive = function(cat) {
      if (($scope.activeCat == cat) || ($state.includes(CATEGORY_STATE) && $stateParams.id == cat.id)) {
        return 'active';
      }
    };

    $scope.toggleCat = function(cat) {
      $scope.checkLink(cat);

      if ($scope.isCatShown(cat)) {
        $scope.activeCat = null;
      } else {
        $scope.activeCat = cat;
      }
    };

    $scope.isCatShown = function(cat) {
      return $scope.activeCat === cat;
    };
  })

//----------------------------------------------------------------------------------------------------------------------------------------------------
// Admin's Ctrls
// Admin Home Ctrl
.controller('aHomeCtrl', function($scope, $ionicNavBarDelegate) {


})
// Admin Products Ctrl
.controller('aProductsCtrl', function ($http, $scope,$state,$ionicPopup) {
$http.get('http://api.inobil.com/v1/Products').then(function (response) {
  $scope.veriler = response.data;
});

$scope.goDetail = function (id) {
  $state.go('detail', {id: id});
  gelenId = id;
};

$scope.secenek = function (id) {

  alert(id);
};

$scope.close = function () {
  $scope.ss=true;
};

$scope.showConfirm = function() {
  var confirmPopup = $ionicPopup.confirm({
    title: 'İşlem Seçin',
    cancelText:'Vazgeç',
    okText:'Sil/Düzenle',
  });

  confirmPopup.then(function(res) {
    if(!res) {
      console.log('iptal');
    } else {

      var comfirmPopup2 = $ionicPopup.confirm({
        title:'İşlem seçin',
        cancelText:'Sil',
        okText:'Düzenle',
      });

      comfirmPopup2.then(function (resp) {
        if(!resp)
        {
          //sile basılıd
        }
        else{
          //alert('duzenleye basildi');
        }

      })
    }
  });
};

})

// Add Product Controller
.controller('addProductCtrl',function ($scope,$http,$state,$cordovaCamera) {

  $scope.imgs =[];

    $scope.selImages = function() {

    window.imagePicker.getPictures(
      function(results) {
        for (var i = 0; i < results.length; i++) {
          console.log('Image URI: ' + results[i]);
          $scope.imgs.push(results[i]);
        }
        if(!$scope.$$phase) {
          $scope.$apply();
        }
      }, function (error) {
        console.log('Error: ' + error);
      }
    );

  };
  $scope.FotografCek = function() {
    var options = {
      quality : 75,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.CAMERA,
      allowEdit : true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgURI = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // An error occured. Show a message to the user
    });
  }

})


//----------------------------------------------------------------------------------------------------------------------------------------------------
// Normal User's Ctrls

.controller('KatalogCtrl',function ($scope,$http,$ionicSlideBoxDelegate,$ionicScrollDelegate,$state,$rootScope) {
   $http.get('http://api.inobil.com/v1/Categories').then(function (response) {
      $scope.categories=response.data;
    });

   $scope.KatalogDetayaGit = function (kategori) {
     $rootScope.katId = kategori.id;
     $state.go('katalogdetay', {id: kategori.id});
     };

})

.controller('KatalogDetayCtrl',function ($scope,$http,$rootScope,$ionicModal,$ionicSlideBoxDelegate,$state) {
  $scope.apiUrl='http://api.inobil.com/v1/catalog/category?categoryId='+$rootScope.katId;
  $scope.getItem = [];
  $scope.totalPages = 0;
  $scope.pageNumber=1;
  $scope.GalleryItems=[];

  function init() {
    for(var i=1;i<$scope.totalPages;i++) {
      $scope.pageNumber++;
      $http.post($scope.apiUrl, {'pageNumber': $scope.pageNumber}, {headers: {'Authorization': 'Bearer '+localStorage['apiToken']}}).then(function (response) {
        for(var j=0;j<6;j++){
          if(response.data.products[j]!=undefined) {
            $scope.getItem.push(response.data.products[j]);
          }else { continue; }
        }
      });
    }

  }

  $http.post($scope.apiUrl, {'pageNumber': $scope.pageNumber}, {headers: {'Authorization': 'Bearer '+localStorage['apiToken']}}).then(function (response) {
    $scope.KatalogDetayVeriler = response.data;
    $scope.getItem = response.data.products;
    $scope.totalPages = response.data.pagingFilteringContext.totalPages;
    init();
  });

  $ionicModal.fromTemplateUrl('image-modal.html', {
    id:'1',
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    modal.show();
    modal.hide();
  });

  $ionicModal.fromTemplateUrl('RenkBedenModal.html', {
    id:'2',
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.RenkBedenModal = modal;
    modal.show();
    modal.hide();
  });

  $scope.openModal = function($index) {
    $ionicSlideBoxDelegate.slide($index);
    $scope.modal.show();
    $ionicSlideBoxDelegate.update();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.TabloAc = function (id) {
    $scope.RenkBedenModal.show();
  };
  $scope.TabloKapat = function () {
    $scope.RenkBedenModal.hide();
  };


  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hide', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
  $scope.$on('modal.shown', function() {
    console.log('Modal is shown!');
  });
  // Call this functions if you need to manually control the slides
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };
  $scope.goToSlide = function(index) {
    $scope.modal.show();
    $ionicSlideBoxDelegate.slide(index);
  };
  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };


  $scope.DetayaGit  = function (id) {
    $state.go('detail',{id: id});
    gelenId = id;
    $scope.closeModal();
  };

  $scope.TabloIcerik = {
    '1':{
      'id':1,
      'renk':'red',
      'envanter':10000
    },
    '2':{
      'id':2,
      'renk':'blue',
      'envanter':5000
    },
    '3':{
      'id':'3',
      'renk':'black',
      'envanter':1500
    },
    '4':{
      'id':'4',
      'renk':'green',
      'envanter':20000
    }
  }


})


// Home controller
.controller('HomeCtrl', function($scope,$http,$ionicSlideBoxDelegate,$ionicScrollDelegate,$cordovaToast) {
  $scope.Change=function () {
    $ionicScrollDelegate.resize();
  };
  $scope.searchText = '';
  $scope.orderValue = "";
  $http.get('http://api.inobil.com/v1/Sliders').then(function (response) {
    $scope.slides = response.data;
    $ionicSlideBoxDelegate.update();
  })
})

// Category controller
.controller('CategoryCtrl',function ($http,$scope,$state,$rootScope,$ionicSideMenuDelegate,$ionicHistory) {
  $scope.Sort = '-id';
  $scope.catId = $rootScope._CatId;
  $scope.catVeriler = [];
  $scope.pageNumber = 1;
  $scope.pageNumberClicked='';
  var totalPages=0;
  $scope.totalPages=[];
  $scope.menuClose = function()
  {

    $ionicSideMenuDelegate.toggleLeft();
    $ionicHistory.nextViewOptions({
      historyRoot: true,
      disableAnimate: true,
      expire: 300
    });
    // if no transition in 300ms, reset nextViewOptions
    // the expire should take care of it, but will be cancelled in some
    // cases. This directive is an exception to the rules of history.js
    $timeout( function() {
      $ionicHistory.nextViewOptions({
        historyRoot: false,
        disableAnimate: false
      });
    }, 300);

  };


  var apiUrlCategory='http://api.inobil.com/v1/catalog/category?categoryId='+$scope.catId+'&pagesize=9';
  function init() {
    $http.post(apiUrlCategory,{'pageNumber':$scope.pageNumber},{headers:{'Authorization':'Bearer '+localStorage['apiToken']}})
      .then(function (response) {
        $scope.catVeriler = response.data;
        totalPages=response.data.pagingFilteringContext.totalPages;
        for(var i=0;i<totalPages;i++)
        {
          $scope.totalPages.push(i+1);
        }
    });
  };

  $scope.callApi = function (pageNumberButtonClicked) {
    $scope.pageNumber=pageNumberButtonClicked;
    $scope.catVeriler=[];
    totalPages=0;
    $scope.totalPages=[];
    init();
  };

  init();
  $scope.goDetail  = function (id) {
    $state.go('detail',{id: id});
    gelenId = id;
  };
  $scope.refresh = function () {
    $scope.$broadcast('scroll.refreshComplete');
    init();
  };

})

// Firma controller
  .controller('FirmaCtrl',function ($scope) {

})

// Products controller
.controller('ProductsCtrl', function ($http, $scope,$state) {
  function init() {
    $http.get('http://api.inobil.com/v1/Products').then(function (response) {
      $scope.stories = response.data;
    });
  }
  $scope.stories = [];
  $scope.Sort = '-id';
  init();
  $scope.goDetail = function (id) {
    $state.go('detail', {id: id});
    gelenId = id;
  };
  $scope.refresh = function () {
    $scope.stories = [];
    $scope.$broadcast('scroll.refreshComplete');
    init();
  };
})
// Product detail controller
.controller('DetailCtrl', function($scope, $http,$ionicSlideBoxDelegate,$cordovaToast,$ionicModal) {
  $scope.quantity = 1;
  var url = 'http://api.inobil.com/v1/product/details?productId='+gelenId;
  $http.get(url,{headers:{'Authorization':'bearer '+localStorage['apiToken']}}).then(function (response) {
    $scope.verilerdetay = response.data;
    $ionicSlideBoxDelegate.update();
  });
  $scope.Add = function() {

      var apiUrl = 'http://api.inobil.com/v1/addproducttocart?productId=' + gelenId + '&shoppingCartTypeId=1&quantity=1&forceredirection=false';
      var message = '';
      return $http.post(apiUrl, {
        'productId': gelenId,
        'shoppingCartTypeId': 1,
        'quantity': $scope.quantity,
        'forceredirection': false
      }, {
        headers: {
          'Authorization': 'bearer ' + localStorage['apiToken']
        }
      })
        .then(function (response) {
          message = response.data.message;
          $cordovaToast.show('Başarıyla sepete eklendi.', 'short', 'bottom');

        }, function (response) {
          $cordovaToast.show(response.data.message, 'short', 'bottom');
        });

    };
  $ionicModal.fromTemplateUrl('image-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    modal.show();
    modal.hide();
  });
  $scope.openModal = function($index) {
    $ionicSlideBoxDelegate.slide($index);
    $scope.modal.show();
    $ionicSlideBoxDelegate.update();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };


  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hide', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
  $scope.$on('modal.shown', function() {
    console.log('Modal is shown!');
  });
  // Call this functions if you need to manually control the slides
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };
  $scope.goToSlide = function(index) {
    $scope.modal.show();
    $ionicSlideBoxDelegate.slide(index);
  };
  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };

})

// Cart controller
.controller('CartCtrl', function($scope,$http,$cordovaToast,$state,$rootScope,$ionicPopup) {

  $scope.productIdsToRemove = [];
  $scope.newCartItemQuantities = [];

  var Cart_Api_Url = 'http://api.inobil.com/v1/cart';
  var orderTotal_Api_Url = 'http://api.inobil.com/v1/ordertotals?isEditable=false';
function init() {

  $http.post(Cart_Api_Url, {'Authorization': 'Bearer ' + localStorage['apiToken']}, {headers: {'Authorization': 'Bearer '+localStorage['apiToken']}}).then(function (response) {
    $scope.cartItems = response.data;
  });

  $http.post(orderTotal_Api_Url, {'Authorization': 'Bearer ' + localStorage['apiToken']}, {headers: {'Authorization': 'Bearer '+localStorage['apiToken']}}).then(function (response) {
    $scope.order = response.data;
  }, function (response) {
    $cordovaToast.show(response.data.message, 'short', 'bottom');
  });
}

$scope.initi = function () {

  $http.post(Cart_Api_Url, {'Authorization': 'Bearer ' + localStorage['apiToken']}, {headers: {'Authorization': 'Bearer '+localStorage['apiToken']}}).then(function (response) {
    $scope.cartItems = response.data;
  });

  $http.post(orderTotal_Api_Url, {'Authorization': 'Bearer ' + localStorage['apiToken']}, {headers: {'Authorization': 'Bearer '+localStorage['apiToken']}}).then(function (response) {
    $scope.order = response.data;
  }, function (response) {
    $cordovaToast.show(response.data.message, 'short', 'bottom');
  });
};

init();


  $scope.Guncelle = function () {
    $http.post('http://api.inobil.com/v1/updatecart',{
      "productIdsToRemove": $scope.productIdsToRemove,
      "newCartItemQuantities": $scope.newCartItemQuantities,
      "checkoutAttributes": [
        {
          "id": 0,
          "value": "string"
        }
      ]
    },{headers: {'Authorization':'Bearer '+ localStorage['apiToken']}}).then(function () {
      $cordovaToast.show('Sepet Güncellendi.','long','bottom');
      $scope.refresh();
      $scope.productIdsToRemove =[];
      $scope.newCartItemQuantities=[];
    },function () {
      $cordovaToast.show('Bir hata meydana geldi','short','bottom');
    });
  };

  $scope.refresh = function () {
    $scope.cartItems = [];
    $scope.$broadcast('scroll.refreshComplete');
    init();
  };


  $scope.AdetDegistir = function(id) {
    $scope.adet= {
      'productId':id,
      'quantity':''
    };
    var myPopup = $ionicPopup.show({
      template: '<input type="number" ng-model="adet.quantity">',
      title: 'Yeni Adeti Girin',
      scope: $scope,
      buttons: [
        { text: 'Vazgeç' },
        {
          text: '<b>Kaydet</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.adet.quantity) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return $scope.adet.quantity;
            }
          }
        }
      ]
    });

    myPopup.then(function() {
      $scope.newCartItemQuantities.push($scope.adet);
      console.log($scope.newCartItemQuantities);
      $scope.Guncelle();
    });

    $timeout(function() {
      myPopup.close(); //close the popup after 3 seconds for some reason
    }, 3000);
  };

  $scope.Cikar = function (id) {
    $scope.productIdsToRemove.push(id);
    $cordovaToast
      .show('Silindi', 'short', 'bottom')
      .then(function(success) {
        $scope.Guncelle();
      }, function (error) {
        // error
      });

  };

  $scope.SiparisVer = function () {
    if($scope.cartItems.items.length!==0){
      $state.go('checkout');
    }else{
      $cordovaToast.show('Sepetiniz boş.','short','bottom');
    }
  };


})

// Checkout Controller, process checkout steps here
.controller('CheckoutCtrl', function($scope, $http, $ionicHistory, $state,$rootScope,$cordovaToast) {

  //Opc Billing form Api -- init
  function init() {
    $http.post('http://api.inobil.com/v1/opcbillingform',{},{headers: {'Authorization': 'Bearer '+localStorage['apiToken']}})
      .then(function (response) {
        $rootScope.OpcBillingForm = response.data;
      },function (response) {
       alert(response.data.message);
      });
  };

  init();

  $rootScope.secondRequestBody = {
    "selectedBillingAddressId": 0,
    "billingAddress": {
      "newAddress": {
        "firstName":'',
        "lastName": '',
        "email": '',
        "companyEnabled": true,
        "companyRequired": true,
        "company": '',
        "countryEnabled": true,
        "countryId": 0,
        "countryName": "string",
        "stateProvinceEnabled": true,
        "stateProvinceId": '',
        "stateProvinceName": '',
        "cityEnabled": true,
        "cityRequired": true,
        "city": '',
        "streetAddressEnabled": true,
        "streetAddressRequired": true,
        "address1": '',
        "streetAddress2Enabled": true,
        "streetAddress2Required": true,
        "address2": '',
        "zipPostalCodeEnabled": true,
        "zipPostalCodeRequired": true,
        "zipPostalCode": '',
        "phoneEnabled": true,
        "phoneRequired": true,
        "phoneNumber": '',
        "faxEnabled": true,
        "faxRequired": true,
        "faxNumber": '',
        "availableCountries": null,
        "availableStates": null,
        "formattedCustomAddressAttributes": "string",
        "customAddressAttributes":null,
        "id": 0,
        "customProperties": {}
      },
      "shipToSameAddress": false,
      "shipToSameAddressAllowed": true,
      "newAddressPreselected": true,
      "customProperties": {}
    },
    "pickupProviderSystemName": "Pickup.PickupInStore",
    "pickupId": '',
    "customProperties": {}
  };

  $rootScope.secondRequestBodySelected = {
    "selectedBillingAddressId": '0',
    "billingAddress": {
      "shipToSameAddress": false,
      "shipToSameAddressAllowed": true,
      "newAddressPreselected": true,
      "customProperties": {}
    },
    "pickupProviderSystemName": "Pickup.PickupInStore",
    "pickupId": "1",
    "customProperties": {}
  };

  $rootScope.YeniAdres = function () {
    console.log($rootScope.secondRequestBody);
   $http.post('http://api.inobil.com/v1/opcsavebillingaddress',$rootScope.secondRequestBody,{headers:{'Authorization':'Bearer '+localStorage['apiToken']}})
     .then(function (response) {
       $rootScope.SecondAPIresponseBody = response.data;
       $state.go('shipping');
     },function (response) {
       alert(response.data.message);
     })
  };

  $rootScope.MevcutAdres = function () {
    console.log('Id : '+ $rootScope.secondRequestBodySelected.selectedBillingAddressId);
    console.log($rootScope.secondRequestBodySelected);
    $http.post('http://api.inobil.com/v1/opcsavebillingaddress',$rootScope.secondRequestBodySelected,{headers:{'Authorization':'Bearer '+localStorage['apiToken']}})
      .then(function (response) {
        $rootScope.SecondAPIresponseBody = response.data;
        console.log($rootScope.SecondAPIresponseBody);
        $state.go('shipping');
      },function (response) {
        console.log(response.data.message+'hata');
      })
  };

  $rootScope.thirdRequestBody={
    "selectedShippingAddressId": 0,
    "shippingAddress": {
      "warnings": [
        "string"
      ],
      "newAddress": {
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "companyEnabled": true,
        "companyRequired": true,
        "company": "string",
        "countryEnabled": true,
        "countryId": 0,
        "countryName": "string",
        "stateProvinceEnabled": true,
        "stateProvinceId": 0,
        "stateProvinceName": "string",
        "cityEnabled": true,
        "cityRequired": true,
        "city": "string",
        "streetAddressEnabled": true,
        "streetAddressRequired": true,
        "address1": "string",
        "streetAddress2Enabled": true,
        "streetAddress2Required": true,
        "address2": "string",
        "zipPostalCodeEnabled": true,
        "zipPostalCodeRequired": true,
        "zipPostalCode": "string",
        "phoneEnabled": true,
        "phoneRequired": true,
        "phoneNumber": "string",
        "faxEnabled": true,
        "faxRequired": true,
        "faxNumber": "string",
        "availableCountries": null,
        "availableStates": null,
        "formattedCustomAddressAttributes": "string",
        "customAddressAttributes": null,
        "id": 0,
        "customProperties": {}
      },
      "newAddressPreselected": true,
      "pickupPoints": null,
      "allowPickUpInStore": true,
      "pickUpInStore": true,
      "pickUpInStoreOnly": true,
      "displayPickupPointsOnMap": true,
      "googleMapsApiKey": "string",
      "customProperties": {}
    },
    "pickupProviderSystemName": "Pickup.PickupInStore",
    "pickupId": "1",
    "customProperties": {}
  };

  $rootScope.thirdRequestBodySelected={
    "selectedShippingAddressId": 0,
    "shippingAddress": {
      "warnings": [
        "string"
      ],
      "newAddressPreselected": true,
      "pickupPoints": null,
      "allowPickUpInStore": true,
      "pickUpInStore": true,
      "pickUpInStoreOnly": true,
      "displayPickupPointsOnMap": true,
      "googleMapsApiKey": "string",
      "customProperties": {}
    },
    "pickupProviderSystemName": "Pickup.PickupInStore",
    "pickupId": "1",
    "customProperties": {}
  };

  $rootScope.thirdButton = function () {
    console.log($rootScope.thirdRequestBody);
    $http.post('http://api.inobil.com/v1/opcsaveshippingaddress',$rootScope.thirdRequestBody,{headers:{'Authorization': 'Bearer '+localStorage['apiToken']}})
      .then(function (response) {
        $rootScope.thirdResponseBody=response.data;
        $state.go('payment');
      },function (response) {
        alert(response.data.message);
      })
  };

  $rootScope.thirdButtonSelected = function () {
    console.log($rootScope.thirdRequestBodySelected);
    $http.post('http://api.inobil.com/v1/opcsaveshippingaddress',$rootScope.thirdRequestBodySelected,{headers:{'Authorization': 'Bearer '+localStorage['apiToken']}})
      .then(function (response) {
        $rootScope.thirdResponseBody=response.data;
        $state.go('payment');
      },function (response) {
        alert(response.data.message);
      })
  };


  $rootScope.paymentRequestBody= {
    "displayRewardPoints": true,
    "rewardPointsBalance": 0,
    "rewardPointsAmount": null,
    "useRewardPoints": true,
    "selectedPaymentMethod": "Payments.CheckMoneyOrder",
    "customProperties": {}
  };

  $rootScope.confirmRequestBody = {
    "paymentMethodSystemName": $rootScope.paymentRequestBody.selectedPaymentMethod,
    "creditCardType": "",
    "creditCardName": "",
    "creditCardNumber": "",
    "creditCardExpireYear": 0,
    "creditCardExpireMonth": 0,
    "creditCardCvv2": "",
    "recurringCycleLength": 0,
    "recurringCyclePeriod": "Days",
    "recurringTotalCycles": 0,
    "customValues": {}
  };

  $rootScope.PaymentButton = function () {
    $http.post('http://api.inobil.com/v1/opcsavepaymentmethod',$rootScope.paymentRequestBody,{headers:{'Authorization': 'Bearer '+localStorage['apiToken']}})
      .then(function (response) {
        $rootScope.paymentResponseBody = response.data;
        $http.post('http://api.inobil.com/v1/opcconfirmorder',$rootScope.confirmRequestBody,{headers:{'Authorization':'Bearer '+localStorage['apiToken']}})
          .then(function (response) {
            $rootScope.confirmResponseBody = response.data;
            $cordovaToast.show('Siparişiniz verildi.','long','bottom');
            $state.go('home');
          },function (response) {
            alert(response.data.message);
          })
      },function (response) {
        alert(response.data.message);
      })
  };

  // complete order
  $rootScope.completeOrder = function() {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });

    $state.go('home');
  }

})

.controller('LoginCtrl', function($scope, $state, $ionicHistory, User) {

  $scope.loginFailed = false;

  $scope.RememberMe = {
    checked:false
  };

  $scope.RememberMeChange = function() {
    console.log('Remember Me Change', $scope.RememberMe.checked);
  };

  $scope.credentials ={
    username:'',
    password:'',
    grant_type:'password'
  };

  $scope.login = function() {
    User.login($scope.credentials,$scope.RememberMe)
      .then(function() {
        $ionicHistory.nextViewOptions({historyRoot: true});
        $state.go('home');
      })
      .catch(function() {
        $scope.loginFailed = true;
      });
  };
})


// Latests controller
.controller('LatestsCtrl',function ($scope,$http) {
  $scope.notifications = [];

  $http.get('https://onesignal.com/api/v1/notifications?app_id=:d4f9c8e6-e347-4ef8-af70-944cfd6ea9de&limit=:50&offset=:0')
    .then(function (response) {
      $scope.notifications=response.notifications.data;

  })

})

// Orders controller
.controller('OrdersCtrl', function () {


})

// Account controller
.controller('AccCtrl',function () {

});
