angular.module('starter.user', [])
  .factory('User', function($http,$rootScope,$cordovaToast) {
    var apiUrl = 'http://api.inobil.com/token';
    var token = localStorage['apiToken'] || '';
    $rootScope.RememberUN = localStorage['userName'];
    $rootScope.RememberPW = localStorage['passWord'];
    $rootScope.role = '';
    if (isNotEmpty(token)) {
      setHeader(token);
    }
    function isNotEmpty(token) {
      return token !== '';
    }
    function setHeader(token) {
      $http.defaults.headers.common.Authorization = 'Bearer ' + token;
    }

    return {
      login: function(credentials,rememberCheck) {
        token = '';
        localStorage['apiToken'] = '';
       return $http({
          method: 'POST',
          url: apiUrl,
          headers: {'Content-Type':'application/x-www-form-urlencoded'
          },
          data: 'username='+credentials.username+'&password='+credentials.password+'&grant_type='+credentials.grant_type
        }).then(function(response) {
            token = localStorage['apiToken'] = response.data.access_token;
            $rootScope.role = response.data.role;
            setHeader(token);
         $cordovaToast
           .show('Hoş Geldiniz', 'short', 'bottom')
           .then(function(success) {
             // success
           }, function (error) {
             // error
           });
          },function () {
         if (rememberCheck.checked == true) {
           localStorage['userName'] = $rootScope.RememberUN = credentials.username;
           localStorage['passWord'] = $rootScope.RememberPW = credentials.password;
         }

         $cordovaToast
           .show('Bir hata oluştu;Sebebi ' +
             '\n- İnternete bağlı olmayabilirsiniz.' +
             '\n- Kullanıcı adı veya şifre yanlış olabilir.', 'long', 'center')
           .then(function(success) {
             // success
           }, function (error) {
             // error
           });
          });
      },
      isLoggedIn: function() {
        return isNotEmpty(token);
      }
    };
  });
