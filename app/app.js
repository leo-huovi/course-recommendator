// app/app.js
angular.module('courseVizApp', [])
.controller('MainController', function($scope, $http) {
    $scope.courses = [];
    $scope.selectedCourse = null;
    $scope.similarCourses = [];
    $scope.loading = false;
    $scope.searchText = '';
    $scope.year = '2023'; // Default year, can be made selectable

    // Load all courses for the selected year
    $http.get(`/api/courses/${$scope.year}`)
        .then(function(response) {
            $scope.courses = response.data.courses;
            console.log('Loaded courses:', $scope.courses.length);
        })
        .catch(function(error) {
            console.error('Error loading courses:', error);
        });

    // Function to handle course selection
    $scope.selectCourse = function(course) {
        $scope.loading = true;
        $scope.selectedCourse = course;

        // Get pre-calculated similarities from MongoDB
        $http.get(`/api/similarities/${$scope.year}/${course.id}`)
            .then(function(response) {
                $scope.similarCourses = response.data.similar_courses;
                $scope.loading = false;
            })
            .catch(function(error) {
                console.error('Error loading similarities:', error);
                $scope.loading = false;
            });
    };

    // Function to get translated name based on language
    $scope.getCourseName = function(course, lang = 'en') {
        return lang === 'fi' ? course.name_fi : course.name_en;
    };
});
