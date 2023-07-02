import { Component, OnInit, computed, inject } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { WordService } from '../../services/word.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { delay, switchMap, tap } from 'rxjs';
import { Word } from '../../interfaces/word.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private wordsService = inject(WordService);
  private fb = inject(FormBuilder);
  user = computed(() => this.authService.currentUser());
  wordPages: any[] = [];
  rowsPerPage = 10;
  currentPage = 0;
  isEdition!: boolean;

  isLoading!: boolean;

  myForm = this.fb.group({
    englishWord: ['', [Validators.required, Validators.minLength(1)]],
    translation: ['', [Validators.required, Validators.minLength(1)]],
  });

  ngOnInit(): void {
    this.wordsService
      .findAllWords(0, 10)
      .pipe(
        tap(() => (this.isLoading = true)),
        delay(1500)
      )
      .subscribe(() => (this.isLoading = false));
  }

  onLogout() {
    this.authService.logout();
  }

  executeSaving() {
    !this.isEdition ? this.saveTranslation() : this.editTranslation();
  }

  editTranslation() {

    this.myForm.reset();
    this.isEdition = false;
  }

  saveTranslation() {
    if (this.myForm.invalid) return;

    const { englishWord, translation } = this.myForm.value;

    if (englishWord && translation)
      this.wordsService
        .createWord({ englishWord, translation })
        .pipe(switchMap(() => this.wordsService.findAllWords(0, 10)))
        .subscribe({
          next: (data) => {
            Swal.fire(
              'Good!',
              `Word "${englishWord}" successfully saved`,
              'success'
            );

            this.myForm.reset();
          },
          error: (error) => Swal.fire('Error', error, 'error'),
        });
  }

  get words() {
    return this.wordsService.words();
  }

  get pagination() {
    return this.wordsService.pagination();
  }

  getTotalPages() {
    const totalPages = Math.ceil(this.pagination.countItems / 10);
    return new Array(totalPages);
  }

  getErrors(control: string) {
    return this.myForm.get(control)?.errors;
  }

  goToPage(i: number) {
    if (i < 0 || i >= this.getTotalPages().length) return;

    this.currentPage = i;

    this.wordsService
      .findAllWords(this.currentPage * this.rowsPerPage, this.rowsPerPage)
      .pipe(tap(() => (this.isLoading = true)))
      .subscribe(() => (this.isLoading = false));
  }

  editWord(word: Word) {
    this.isEdition = true;

    this.myForm.setValue({
      englishWord: word.englishWord,
      translation: word.translation,
    });
  }
}
