import React, { Component } from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import teacherCreateClass from '../../assets/images/help/teacher-quizzes-statistics.png';
import creator from '../../assets/images/help/creatortitle.png';
import buttonbar from '../../assets/images/help/creatoradd.png';
import mult from '../../assets/images/help/creatormultiplechoice.png';
import sing from '../../assets/images/help/creatorsinglechoice.png';
import match from '../../assets/images/help/creatormatch.png';
import cloze from '../../assets/images/help/clozecreator.png';
import mix from '../../assets/images/help/mixcreator.png';
import cross from '../../assets/images/help/crosscreator.png';
import classes from '../../assets/images/help/teacher-my-classes.png';

export default class HelpPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Grid className="helpPageWrapper">
        <Row>
          <Col md={12}>
            <div className="section_container">
              <h1>Teacher</h1>
              <div className="section_body">
                <p>As soon as you log in, you will see a navigation bar at the top
                  of the screen. There are 3 important buttons in there:
                </p>
                <ul>
                  <li>My Quizzes Tab where you can manage your quizzes</li>
                  <li>My Classes Tab where you can manage your classes and students</li>
                  <li>My Account tab where you can change between
                    student/teacher role and manage your password
                  </li>
                </ul>
                <h2>My Quizzes</h2>
                <div className="myquizzes_container">
                  <p>This is where you will create, edit and publish your quizzes. Everything
                  you will ever use to assess your students, will be created here.</p>
                  <img src={teacherCreateClass} alt="" />
                  <p>In order to create a quiz, press the button with the green
                    cross that reads &quot;Create a Quiz&quot;. If you do not see the
                    button, go to My Account, Settings, and make sure the button
                    is set into teacher mode.</p>
                  <img className="small" src={creator} alt="" />
                  <img className="small" src={buttonbar} alt="" />
                  <p>What you should be seeing is a similar version of this. Here,
                    you have all the tools required to create any of the 6 types of quizzes.</p>
                  <p>Below is a rundown of all the fields and buttons and tools you can
                  play with:</p>
                  <ul>
                    <li><h4>Title:</h4><p> This will be the title of your quiz.
                    You can name it however you want to, and the students will be able
                    to see it as soon as you publish and add it to your class.</p></li>
                    <li><h4>Number of attempts:</h4><p> This is how you will restrict how
                    many times a student will be able to solve this quiz. If you would like
                    to create a quiz that does not restrict the number of attempts,
                    write 0 in the field.</p></li>
                    <li><h4>Release date:</h4><p> This is the date your quiz will display.
                    If you decide that you want to create a quiz now and release it sometime in
                    the future, simply select that future date, and the quiz will be hidden
                    until then.</p></li>
                    <li><h4>Negative marking:</h4><p> This is a feature that has been
                    eagerly requested, and we were more than happy to implement it.
                     It works as any other quiz does, except the student <b>loses</b> marks
                     for picking the wrong answer. However, the students
                     loses no marks if he does not
                     attempt to answer the question. For example if a question is worth 15 marks,
                     a student completing the quiz has the option of answering the question
                     and risking to lose 15 marks from his overall score, or leave it blank
                     for 0 points. This is a feature that promotes knowledge and
                     confidence above luck.</p></li>
                    <li><h4>Points:</h4><p> Every question you create will have a points
                    field. If you do not put a value in your field, it will be counted
                    as 0 points for that question.</p></li>
                    <li><h4>Multiple Choice:</h4><p> Pressing this button will create a
                    card containing multiple choice frame. The steps in order to create a
                    valid question are pretty straight forward. When you want to pick
                    an option as correct, simply tick the answer checkbox to
                    the right of it. Removing an an option is done by pressing the red X,
                    also to the right of it.</p></li>
                    <img className="" src={mult} alt="" />
                    <li><h4>Single choice:</h4><p> Is practically a multiple choice
                    question with the restriction of having only 1 option as being
                    the correct one.</p></li>
                    <img className="" src={sing} alt="" />
                    <li><h4>Match Quiz:</h4><p> A match question is an exercise where
                    you attempt to match every row on the left, with an option on the right.
                    If you would like to match more pairs, press the &quot;Add Match Element&quot;
                    or to remove some, the red X.</p></li>
                    <img className="" src={match} alt="" />
                    <li><h4>Cloze Quiz:</h4><p> In order to create a
                     &quot;Fill in the gaps&quot; question, press the Cloze button. You will
                     see that the sentence has a special format where the word between
                     the brackets will be the solution, and the hint will be between
                     asterisks.</p></li>
                     <img className="" src={cloze} alt="" />
                    <li><h4>Mix Quiz:</h4><p> This question will split your sentence
                    into words and jumble them. This can also be used for letters as long
                    as you split them using spaces.</p></li>
                    <img className="" src={mix} alt="" />
                    <li><h4>Cross Quiz:</h4><p> This exercise is very customisable, as it
                    gives you many options. You can choose your board size and create your own
                    design or you can simply type in your words each on a different line,
                    and press the generate button, which will automatically create a
                    design for you.</p></li>
                    <img className="" src={cross} alt="" />
                  </ul>
                  <p>After you save your quiz, you will be taken to a review screen where
                  you can see what you have created, the points and answers to the questions.</p>
                  <p>Pressing the edit button will take you to an edit screen where you can edit
                  every question that you have created so far. Publishing a quiz will move
                  the quiz from the unpublished to the published tab.</p>
                  <p> A very useful feature is searching for quizzes, and the only thing
                  you have to do is simply start writing in the field with the search icon
                  and you should immediately see changes.</p>
                  <p>The usual steps for giving students to a quiz is: create a quiz,
                  publish it, assign it to a class with students.</p>
                </div>
                <h2>My Classes</h2>
                <div className="myclasses_container">
                  <img className="" src={classes} alt="" />
                  <p>There will be 3 items on the sidebar when you switch to this tab
                  (assuming you have not created any classes). &quot;My Classes&quot;
                  button which always redirect you to the &quot;My Classes&quot; general
                  page, &quot;Create a Class&quot; where you can create your own class,
                  and the search field, where you can search through your classes.</p>
                  <h3>Class Manager</h3>
                  <p>Once you have created a class, you will be able to see it
                  under the search field. Clicking on it will open a manager just for
                  that class. There are visible 2 main sections: Quizzes section and
                  a Students section.</p>
                  <h4>Quizzes Section</h4>
                  <p>This is the section where you assign and remove quizzes to/from your class.
                  There is also a handy search bar to use, in case you have many quizzes.</p>
                  <h4>Students Section</h4>
                  <p>This is the section where you will manage the access to your class.</p>
                  <p>On the first tab you can manage the enrolled students in the class,
                  by adding or removing existing students. Again, you have a search bar
                  which works by email adress and name.</p>
                  <p>The next tab contains the students that have requested to join your class.
                  You have full control over it. Accept or reject them, the power is yours!</p>
                  <p>Onto the 3rd tab, we have implemented a functionality to aid your needs.
                  Simply enter the email address of the student you would like to invite to your
                  class and we will make sure he receives an invitation to join.
                  However, if the user already exists, he will be added directly to
                  your class without him having to accept any invitation.</p>
                  <p>The last tab is here to make your life just a little bit easier.
                  Select a .csv file that has an &quot;email&quot; column, and we will
                  invite/add them to your class. </p>
                </div>
                <h2>My Account</h2>
                <div className="mysettings_container">
                  <h3>Settings</h3>
                  <p>A niche feature of this product is the ability to switch
                  between user/teacher mode with the click of a single button, which
                  you should be able to see as soon as you click on &quot;Settings&quot;</p>
                  <p>There is also a password change form, just in case you get bored of
                  your current one.</p>
                </div>
              </div>
            </div>
          </Col>
          <Col md={12}>
            <div className="section_container">
              <h1>Student</h1>
              <div className="section_body">
                <h2>My Quizzes</h2>
                <div className="myquizzes_container">
                  <p>As a student, the options on this panel, are to: search for
                    quizzes, start attempting to solve a quiz, see the ones in progress,
                    or the past attempts for any of them.</p>
                </div>
                <h2>My Classes</h2>
                <div className="myclasses_container">
                  <p>On this page, you have the ability to request to join a class
                  by searching for the class then sending a request, searching for
                  classes that you are a part of, or opening a certain class.
                  On opening a class, information about that class will be provided:
                  the quizzes in that class and statistics about the grades.</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }

}
