import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TweetService } from '../tweet.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class HomeComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private tweetService: TweetService,
  ) {}
  //@ts-ignore
  tweetForm = this.fb.group({
    content: ['', Validators.required],
  });

  tweets: any[] = [];

  ngOnInit() {
    this.loadTweets();
  }

  postTweet() {
    if (this.tweetForm.valid) {
      //@ts-ignore
      this.tweetService.postTweet(this.tweetForm.value).subscribe(() => {
        this.tweetForm.reset();
        this.loadTweets();
      });
    }
  }

  loadTweets() {
    this.tweetService.getTweets().subscribe((data) => {
      this.tweets = data;
    });
  }
}
