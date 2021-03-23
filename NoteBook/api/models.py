from django.db import models

# Create your models here.

class Note(models.Model):
    date = models.DateField(auto_now=True,editable=False)
    content = models.TextField()

    def __str__(self):
        return f"Note # {self.pk}"

    # class Meta:
    #     ordering = ['date']
