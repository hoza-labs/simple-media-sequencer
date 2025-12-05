mediaDelay_ms = 100;         // minimum value is 100ms
mediaDuration_ms = 60000;

/* -------------------------------------------------------------------------------------------------------------------
    media types:
     o  new image('url', 'options')
     o  new audio('url', 'options')
     o  new video('url', 'options')

    possible options:
    width: w;           // w is in variable units (default 100%)
    start: a;           // a is in seconds (default 0.0) (audio/video)
    stop:  b;           // b is in seconds (default end of recording) (audio/video)
    volume: v;          // v is in seconds and sets the video volume from 0.0 to 1.0 (default 0.0) (video only)
    display: none;      // 'none' hides the video (default is 'inline' which shows the video) (video only)

    note: any option not listed above is passed forward to the HTML 'style' attribute

    examples:

    // play the sound only, for time index 9-13 seconds ("are you pretty?")
    new video('../subjects/white-bellied-caique.mp4', 'width: 60%; start: 9; stop: 13.0; volume: 1.0; display: none;')
    new image('../subjects/white-bellied-caique.jpg', 'width: 60%;'),
    new video('../subjects/white-bellied-caique.mp4', 'width: 80%; start: 9; stop: 13.0; volume: 1.0;'),
    new image('../subjects/white-bellied-caique.jpg', 'width: 60%;'),
    new audio('../samples/sample-very-short.mp3'),
    new video('../subjects/white-bellied-caique.mp4', 'width: 60%; start: 20; stop: 23;'),
    new video('../subjects/harpy-eagle.mp4', 'width: 60%; start: 20;'),
    new video('../subjects/stellers-jay.mp4', 'width: 60%')

--------------------------------------------------------------------------------------------------------------------- */

mediaList =
[
  new image('../images/whiteBellyCaique.jpg'),
  new video('../videos/caique.mp4'),
  new audio('../sounds/caique.mp3', 'start: 3;'),

  new image('../images/harpyeagle.jpg', 'width: 100%;'),
  new video('../videos/harpyeagle.mp4', 'start:20.0;'),
  new audio('../sounds/harpyeagle.mp3', 'start: 3;'),

  new image('../images/stellersjay.jpg'),
  new video('../videos/Stellersjaymp4.mp4'),
  new audio('../sounds/Stellers_Jay.mp3'),

  new image('../images/man.jpg', 'width: 60%;'),
  new video('../videos/man.mp4'),
  new video('../sounds/man.mp4', 'display: none; volume: 1;'),

  new image('../images/woman.jpg'),
  new video('../videos/woman.mp4', 'start: 16;'),
  new video('../sounds/woman.mp4', 'display: none; volume: 1; start: 16;'),

  new image('../images/manandwoman.jpg', 'width: 60%;'),
  new video('../videos/manandwoman.mp4', 'start: 3;'),
  new video('../sounds/manandwoman.mp4', 'display: none; volume: 1;'),

  new image('../images/monkehy.jpg'),
  new video('../videos/BrownCapuchinMonkey.mp4', 'width: 80%;'),
  new video('../sounds/monkey.mp4', 'display: none; volume: 1;'),

  new image('../images/-White-tailed_deer.jpg'),
  new video('../videos/white-taileddeer.mp4'),
  new video('../sounds/white-taileddeer.mp4', 'display: none; volume: 1;'),

  new image('../images/amazon-horned-frog.jpg'),
  new video('../videos/frog.mp4'),
  new video('../sounds/frog.mp4', 'display: none; volume: 1;')
 
];

