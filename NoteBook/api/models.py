from django.db import models

# Create your models here.

class Note(models.Model):
    content = models.TextField()

    def __str__(self):
        return f"Note # {self.pk}"
