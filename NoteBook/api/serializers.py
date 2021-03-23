from rest_framework import serializers
from .models import Note
import datetime

class NoteSerializer(serializers.ModelSerializer):

    def to_representation(self, data):
        data = super(NoteSerializer, self).to_representation(data)
        x = data.get('date')
        x = datetime.datetime.strptime(x,"%Y-%m-%d").strftime("%B %d, %Y")
        data['date'] = x
        return data

    class Meta:
        model = Note
        fields = '__all__'
