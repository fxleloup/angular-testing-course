import {CoursesService} from "./courses.service";
import {async, TestBed} from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {COURSES, findLessonsForCourse} from "../../../../server/db-data";
import {Course} from "../model/course";
import {HttpErrorResponse} from "@angular/common/http";
import {Lesson} from "../model/lesson";

describe('CoursesService unit tests', () => {

  let coursesServiceUnderTest: CoursesService;
  let httpClientMock: HttpTestingController;

  // given (injection de dépendances)
  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        CoursesService
      ]
    });
    coursesServiceUnderTest = TestBed.get(CoursesService);
    httpClientMock = TestBed.get(HttpTestingController);
  });

  // then (final assertion)
  afterAll(() => {
    httpClientMock.verify(); // verify no more interaction
  });

  it('Should retrieve all expected courses', () => {
    // given
    const givenAllCourses: Course[] = Object.values(COURSES);
    const expectedHttpPath: string = '/api/courses';
    const expectedHttpMethod: string = 'GET';
    // when
    coursesServiceUnderTest.findAllCourses()
      .subscribe( // exécuté au flush de la requête http
        actualCourses => {
          expect(actualCourses).toBe(givenAllCourses); // mapping assertions
        });
    const httpRequestCaptor = httpClientMock.expectOne(expectedHttpPath);
    expect(httpRequestCaptor.request.method).toEqual(expectedHttpMethod);
    httpRequestCaptor.flush({payload: givenAllCourses}); // stub & execution
  });

  it('Should find an expected course by its id', () => {
    // given
    const givenCourseId: number = 12;
    const givenCourse: Course = COURSES[givenCourseId];
    const expectedHttpPath: string = '/api/courses/' + givenCourseId;
    const expectedHttpMethod: string = 'GET';
    // when
    coursesServiceUnderTest.findCourseById(givenCourseId)
      .subscribe( // exécuté au flush de la requête http
        actualCourseFound => {
          expect(actualCourseFound).toBe(givenCourse); // mapping assertions
        });
    const httpRequestCaptor = httpClientMock.expectOne(expectedHttpPath);
    expect(httpRequestCaptor.request.method).toEqual(expectedHttpMethod);
    httpRequestCaptor.flush(givenCourse); // stub & execution
  });

  it('Should save the expected course data', () => {
    // given
    const givenCourseId: number = 12;
    const givenCourse: Course = COURSES[givenCourseId];
    const givenModifiedTitlesDescription: string = 'Testing Course';
    const givenCourseChanges: Partial<Course> = {titles: {description: givenModifiedTitlesDescription}};
    const expectedUpdatedCourse: Course = {...givenCourse, ...givenCourseChanges};
    const expectedHttpPath: string = '/api/courses/' + givenCourseId;
    const expectedHttpMethod: string = 'PUT';
    // when
    coursesServiceUnderTest.saveCourse(givenCourseId, givenCourseChanges)
      .subscribe( // exécuté au flush de la requête http
        course => {
          expect(course).toBe(expectedUpdatedCourse); // mapping assertions
        });
    const httpRequestCaptor = httpClientMock.expectOne(expectedHttpPath);
    expect(httpRequestCaptor.request.method).toEqual(expectedHttpMethod);
    expect(httpRequestCaptor.request.body).toEqual(givenCourseChanges);
    httpRequestCaptor.flush(expectedUpdatedCourse); // stub & execution
  });

  it('Should give an error if save course fails', () => {
    // given
    const givenCourseId: number = 12;
    const givenModifiedTitlesDescription: string = 'Testing Course';
    const givenCourseChanges: Partial<Course> = {titles: {description: givenModifiedTitlesDescription}};
    const expectedHttpPath: string = '/api/courses/' + givenCourseId;
    const expectedHttpMethod: string = 'PUT';
    const givenErrorMessage: string = "save course failed";
    const givenErrorStatusCode: number = 500;
    const givenErrorStatusText: string = "Internal server error";
    const givenErrorDetails: Partial<HttpErrorResponse> = {
      status: givenErrorStatusCode,
      statusText: givenErrorStatusText
    };
    // when
    coursesServiceUnderTest.saveCourse(givenCourseId, givenCourseChanges)
      .subscribe( // exécuté au flush de la requête http
        () => fail("the save course should have failed"),
        (httpErrorResponse: HttpErrorResponse) => {
          expect(httpErrorResponse.error).toBe(givenErrorMessage);  // mapping assertions
          expect(httpErrorResponse.status).toBe(givenErrorStatusCode);
          expect(httpErrorResponse.statusText).toBe(givenErrorStatusText);
        });
    const httpRequestCaptor = httpClientMock.expectOne(expectedHttpPath);
    expect(httpRequestCaptor.request.method).toEqual(expectedHttpMethod);
    expect(httpRequestCaptor.request.body).toEqual(givenCourseChanges);
    httpRequestCaptor.flush(givenErrorMessage, givenErrorDetails); // stub & execution
  });

  it('Should find a list of lessons', () => {
    // given
    const givenCourseId: number = 12;
    const givenFilter: string = 'okok';
    const givenSortOrder: string = 'desc';
    const givenPageNumber: number = 1;
    const givenPageSize: number = 3;
    const expectedHttpPath: string = '/api/lessons';
    const expectedHttpMethod: string = 'GET';
    const givenAllLessons: Lesson[] = findLessonsForCourse(givenCourseId).slice(0, 3);
    // when
    coursesServiceUnderTest.findLessons(givenCourseId, givenFilter, givenSortOrder, givenPageNumber, givenPageSize)
      .subscribe( // exécuté au flush de la requête http
        actualLessons => {
          expect(actualLessons).toBe(givenAllLessons); // mapping assertions
        });
    const httpRequestCaptor = httpClientMock.expectOne(req => req.url == expectedHttpPath);
    expect(httpRequestCaptor.request.method).toEqual(expectedHttpMethod);
    expect(httpRequestCaptor.request.params.get("courseId")).toEqual('' + givenCourseId);
    expect(httpRequestCaptor.request.params.get("filter")).toEqual(givenFilter);
    expect(httpRequestCaptor.request.params.get("sortOrder")).toEqual(givenSortOrder);
    expect(httpRequestCaptor.request.params.get("pageNumber")).toEqual('' + givenPageNumber);
    expect(httpRequestCaptor.request.params.get("pageSize")).toEqual('' + givenPageSize);
    httpRequestCaptor.flush({payload: givenAllLessons}); // stub & execution
  });
});
