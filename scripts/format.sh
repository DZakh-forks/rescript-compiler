#!/bin/bash

shopt -s extglob

dune build @fmt --auto-promote
./rescript format jscomp/@(others|runtime|test)/*.@(res|resi)
