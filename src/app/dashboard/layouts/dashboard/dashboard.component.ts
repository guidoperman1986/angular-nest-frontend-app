import { Component, OnInit, computed, inject } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { WordService } from '../../services/word.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

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

  myForm = this.fb.group({
    englishWord: ['', [Validators.required, Validators.minLength(1)]],
    translation: ['', [Validators.required, Validators.minLength(1)]],
  });

  ngOnInit(): void {
    this.wordsService.findAllWords(0, 10).subscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  saveTranslation() {
    if (this.myForm.invalid) return;

    const { englishWord, translation } = this.myForm.value;

    if (englishWord && translation)
      this.wordsService.createWord({ englishWord, translation }).subscribe({
        next: (data) => {
          Swal.fire(
            'Good!',
            `Word ${data.englishWord} successfully saved`,
            'success'
          );

          this.myForm.reset()
        },
        error: (error) => Swal.fire('Error', error, 'error'),
      });
  }

  get words() {
    console.log(this.wordsService.words());
    return this.wordsService.words();
  }

  getErrors(control: string) {
    return this.myForm.get(control)?.errors;
  }
}
