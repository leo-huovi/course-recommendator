// app/app.js
angular.module('courseVizApp', [])
.controller('MainController', function($scope, $http) {
    $scope.courses = [];
    $scope.selectedCourse = null;
    $scope.similarCourses = [];
    $scope.loading = false;
    $scope.searchText = '';
    $scope.year = '2023';

    // Load courses from your MongoDB structure
    $http.get(`/opintosuunnitelmat/${$scope.year}`)
        .then(function(response) {
            $scope.courses = response.data.courses;
            console.log('Loaded courses:', $scope.courses.length);
        })
        .catch(function(error) {
            console.error('Error loading courses:', error);
        });

    // Calculate cosine similarity between two embeddings
    function cosineSimilarity(embedA, embedB) {
        if (!embedA || !embedB) return 0;

        let dotProduct = 0;
        let normA = 0;
        let normB = 0;

        for (let i = 0; i < embedA.length; i++) {
            dotProduct += embedA[i] * embedB[i];
            normA += embedA[i] * embedA[i];
            normB += embedB[i] * embedB[i];
        }

        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    // Function to handle course selection
    $scope.selectCourse = function(course) {
        $scope.loading = true;
        $scope.selectedCourse = course;

        // Calculate similarities
        let similarities = $scope.courses
            .filter(c => c.id !== course.id && c.embedding)
            .map(c => ({
                ...c,
                similarity: cosineSimilarity(course.embedding, c.embedding)
            }))
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 5);

        $scope.similarCourses = similarities;
        $scope.loading = false;
    };

    $scope.getCourseName = function(course, lang = 'en') {
        return lang === 'fi' ? course.name_fi : course.name_en;
    };
});
