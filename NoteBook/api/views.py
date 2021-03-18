from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import NoteSerializer
from .models import Note

# Create your views here.

@api_view(['GET',])
def apiOverview(request):
    api_urls = {
        'Notes list':'/notes-list/',
        'Note detail':'/note-detail/<str:pk>/',
        'Create note':'/create-note/',
        'Update note':'/update-note/<str:pk>/',
        'Delete note':'/delete-note/<str:pk>/',
    }
    return Response(api_urls)


@api_view(['GET',])
def noteList(request):
    notes = Note.objects.all().order_by('-id')
    serializer = NoteSerializer(notes,many=True)
    return Response(serializer.data)


@api_view(['GET',])
def noteDetail(request,pk):
    note = Note.objects.get(id=pk)
    serializer = NoteSerializer(note,many=False)
    return Response(serializer.data)


@api_view(['POST',])
def noteCreate(request):
    serializer = NoteSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(['POST',])
def noteUpdate(request,pk):
    note = Note.objects.get(id=pk)
    serializer = NoteSerializer(instance=note,data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(['DELETE',])
def noteDelete(request,pk):
    note = Note.objects.get(id=pk)
    note_num = note.id
    note.delete()
    return Response(f"Note #{note_num} deleted")
